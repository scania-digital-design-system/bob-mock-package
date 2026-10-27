package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"slices"
	"sort"
	"strings"

	"traton-contracts"
	"traton-design-system-poc/src/client/layout"
	"traton-design-system-poc/src/domain"
)

// cellCommand writes every generated file of every cell with BOB's own delivery code
// around the hand-written component.jsx and component.css (ADR 0003 D1).
func cellCommand(args []string) int {
	flags := flag.NewFlagSet("cell", flag.ExitOnError)
	root := flags.String("root", "..", "repo root holding cells/ and payloads/")
	_ = flags.Parse(args)
	dirs, err := filepath.Glob(filepath.Join(*root, cellGlob))
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return 2
	}
	sort.Strings(dirs)
	for _, dir := range dirs {
		if err := deliverCell(*root, dir, filepath.Join(*root, "cells")); err != nil {
			fmt.Fprintln(os.Stderr, err)
			return 2
		}
		fmt.Println("wrote", dir)
	}
	return 0
}

// deliverCell builds the cell the pipeline's bootstrap path would deliver and writes it
// under outRoot with layout.WriteCell. Writing to the cells/ root rewrites the
// hand-written files with their own bytes.
func deliverCell(root, dir, outRoot string) error {
	rel, err := filepath.Rel(filepath.Join(root, "cells"), dir)
	if err != nil {
		return fmt.Errorf("cell: locate %s: %w", dir, err)
	}
	target, component, brand := splitCellPath(rel)
	c, err := loadCell(dir, brand, target)
	if err != nil {
		return fmt.Errorf("cell: %s: %w", rel, err)
	}
	req, err := loadRequest(filepath.Join(root, "payloads", component+".json"))
	if err != nil {
		return fmt.Errorf("cell: %s: %w", rel, err)
	}
	delivery, err := deliveryCell(c, req, component)
	if err != nil {
		return fmt.Errorf("cell: %s: %w", rel, err)
	}
	if got := layout.CellRelDir(delivery.CellID); got != filepath.ToSlash(rel) {
		return fmt.Errorf("cell: %s: the contract places this cell at %s", rel, got)
	}
	return layout.WriteCell(outRoot, delivery)
}

// deliveryCell mirrors the bootstrap path: the drafted contract (intake's
// chooseContract with no registry entry and no blessed cell), an empty token source
// (pipeline_cell.go), and api.json from BuildAPIReferenceJSON (deliver.Deliverer).
func deliveryCell(c cell, req contracts.PublishRequest, component string) (domain.DeliveryCell, error) {
	if err := servesCell(req, component, c.Brand, c.Target); err != nil {
		return domain.DeliveryCell{}, err
	}
	draft := domain.DraftContract(component, req.Surface)
	if !draft.Confident() {
		return domain.DeliveryCell{}, fmt.Errorf("unresolved surface properties %v: add an answer for each", draft.Unresolved)
	}
	tokens, err := deriveTokens(req.Variables, c.Brand)
	if err != nil {
		return domain.DeliveryCell{}, err
	}
	cellID, err := domain.NewCellID(component, c.Brand, c.Target, draft.Contract.Version)
	if err != nil {
		return domain.DeliveryCell{}, fmt.Errorf("cell id: %w", err)
	}
	surface, err := publicAPISurface(c.Markup)
	if err != nil {
		return domain.DeliveryCell{}, err
	}
	apiRef, err := domain.BuildAPIReferenceJSON(draft.Contract, surface)
	if err != nil {
		return domain.DeliveryCell{}, fmt.Errorf("api reference: %w", err)
	}
	return domain.DeliveryCell{
		CellID:           cellID,
		ComponentSource:  c.Markup,
		Contract:         draft.Contract,
		PublicAPISurface: surface,
		APIReferenceJSON: apiRef,
		Rules:            draft.Contract.Rules,
		Styles:           c.Styles,
		Tokens:           tokens,
	}, nil
}

func servesCell(req contracts.PublishRequest, component, brand, target string) error {
	switch {
	case req.Component != component:
		return fmt.Errorf("payload is for %q, not %q", req.Component, component)
	case !slices.Contains(req.Brands, brand):
		return fmt.Errorf("payload brands %v do not include %q", req.Brands, brand)
	case !slices.Contains(req.Targets, target):
		return fmt.Errorf("payload targets %v do not include %q", req.Targets, target)
	}
	return nil
}

var componentSignature = regexp.MustCompile(`^function\s+\w+\(\s*\{`)

// publicAPISurface lists the props the component destructures, which is what the
// bootstrap prompt asks the model to report ("every externally-visible prop/slot your
// markup exposes"). A rest element is not a named prop and is skipped.
func publicAPISurface(markup string) ([]string, error) {
	source := strings.TrimSpace(markup)
	loc := componentSignature.FindStringIndex(source)
	if loc == nil {
		return nil, fmt.Errorf("component.jsx does not start with function Name({ … })")
	}
	params, ok := braceBody(source[loc[1]-1:])
	if !ok {
		return nil, fmt.Errorf("component.jsx: unbalanced braces in the props parameter")
	}
	surface := []string{}
	for _, entry := range splitTopLevel(params) {
		if name := propName(entry); name != "" {
			surface = append(surface, name)
		}
	}
	return surface, nil
}

// braceBody returns the text inside the brace pair that s starts with.
func braceBody(s string) (string, bool) {
	depth := 0
	for i, r := range s {
		switch r {
		case '{', '(', '[':
			depth++
		case '}', ')', ']':
			depth--
		}
		if depth == 0 {
			return s[1:i], true
		}
	}
	return "", false
}

// splitTopLevel splits on commas that are not inside brackets or quotes.
func splitTopLevel(s string) []string {
	var parts []string
	depth, start := 0, 0
	var quote rune
	for i, r := range s {
		switch {
		case quote != 0:
			if r == quote {
				quote = 0
			}
		case r == '\'' || r == '"' || r == '`':
			quote = r
		case r == '{' || r == '(' || r == '[':
			depth++
		case r == '}' || r == ')' || r == ']':
			depth--
		case r == ',' && depth == 0:
			parts = append(parts, s[start:i])
			start = i + 1
		}
	}
	return append(parts, s[start:])
}

// propName reads the prop key of one destructuring entry: "size = 'lg'" → size,
// "variant: kind" → variant, "...rest" → "".
func propName(entry string) string {
	entry = strings.TrimSpace(entry)
	if entry == "" || strings.HasPrefix(entry, "...") {
		return ""
	}
	if i := strings.IndexAny(entry, "=:"); i >= 0 {
		entry = entry[:i]
	}
	return strings.TrimSpace(entry)
}
