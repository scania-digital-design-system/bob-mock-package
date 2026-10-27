package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"

	"traton-contracts"
	"traton-design-system-poc/src/domain"
)

const (
	componentFile = "component.jsx"
	stylesFile    = "component.css"
	apiFile       = "api.json"
	tokensPayload = "_tokens.json"
)

// cell is one hand-written cell as the bootstrap stage would hand it to the gate:
// the rendered markup, the stylesheet and the proposed public API surface.
type cell struct {
	Brand            string
	Target           string
	Markup           string
	Styles           string
	PublicAPISurface []string
}

// apiReference is the slice of api.json the gate reads.
type apiReference struct {
	PublicAPISurface []string `json:"publicApiSurface"`
}

// loadCell reads a cell directory. api.json is optional: before the generator has
// run, the cell proposes no API and the surface check has nothing to read.
func loadCell(dir, brand, target string) (cell, error) {
	markup, err := os.ReadFile(filepath.Join(dir, componentFile))
	if err != nil {
		return cell{}, fmt.Errorf("gate: read markup: %w", err)
	}
	styles, err := readOptional(filepath.Join(dir, stylesFile))
	if err != nil {
		return cell{}, fmt.Errorf("gate: read styles: %w", err)
	}
	surface, err := readSurface(filepath.Join(dir, apiFile))
	if err != nil {
		return cell{}, err
	}
	return cell{Brand: brand, Target: target, Markup: string(markup), Styles: string(styles), PublicAPISurface: surface}, nil
}

func readOptional(path string) ([]byte, error) {
	raw, err := os.ReadFile(path)
	if errors.Is(err, fs.ErrNotExist) {
		return nil, nil
	}
	return raw, err
}

func readSurface(path string) ([]string, error) {
	raw, err := readOptional(path)
	if err != nil || raw == nil {
		return nil, err
	}
	var api apiReference
	if err := json.Unmarshal(raw, &api); err != nil {
		return nil, fmt.Errorf("gate: parse %s: %w", path, err)
	}
	return api.PublicAPISurface, nil
}

// loadRequest reads a component payload. A payload that carries no variables takes
// the shared block from _tokens.json beside it, so the tokens are written once.
func loadRequest(path string) (contracts.PublishRequest, error) {
	var req contracts.PublishRequest
	if err := readJSON(path, &req); err != nil {
		return req, err
	}
	if len(req.Variables.Variables) > 0 {
		return req, nil
	}
	err := readJSON(filepath.Join(filepath.Dir(path), tokensPayload), &req.Variables)
	return req, err
}

func readJSON(path string, into any) error {
	raw, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("gate: read %s: %w", path, err)
	}
	if err := json.Unmarshal(raw, into); err != nil {
		return fmt.Errorf("gate: parse %s: %w", path, err)
	}
	return nil
}

// artifact builds the per-cell gate input the way the pipeline's cellHardGateReq
// does (pipeline/src/usecase/pipeline_helpers.go): markup in both CSS and Markup,
// defined tokens from the brand's derived token set, and every surface property's
// values as the class-closure expansion set (intake/assemble.go).
func artifact(c cell, req contracts.PublishRequest) (domain.GateArtifact, error) {
	tokens, rejected, err := domain.DeriveDesignTokens(req.Variables, c.Brand)
	if err != nil {
		return domain.GateArtifact{}, fmt.Errorf("gate: derive tokens: %w", err)
	}
	if len(rejected) > 0 {
		return domain.GateArtifact{}, fmt.Errorf("gate: %d variables did not bind for %s: %+v", len(rejected), c.Brand, rejected)
	}
	declared := map[string][]string{}
	for _, property := range req.Surface.Properties {
		declared[property.Name] = property.Values
	}
	return domain.GateArtifact{
		Brand:            c.Brand,
		Target:           c.Target,
		CSS:              c.Markup,
		Styles:           c.Styles,
		Markup:           c.Markup,
		PublicAPISurface: c.PublicAPISurface,
		DefinedTokens:    tokens.DefinedTokenNames(),
		PropertyValues:   declared,
	}, nil
}
