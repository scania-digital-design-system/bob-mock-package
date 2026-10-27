package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"

	"traton-contracts"
	pipelinecontracts "traton-design-system-poc/contracts"
	"traton-design-system-poc/src/adapter/hardgate"
	"traton-design-system-poc/src/adapter/resolve"
	"traton-design-system-poc/src/domain"
)

// tegelTokenSet names the vocabulary we add to BOB's (ADR 0003 D3).
const tegelTokenSet = "tegel"

// tokensCommand emits tokens/<brand>.css with BOB's web binding and rules/ruledata.json
// as BOB's v2 plus the tegel token set (ADR 0003 D2, D3).
func tokensCommand(args []string) int {
	flags := flag.NewFlagSet("tokens", flag.ExitOnError)
	root := flags.String("root", "..", "repo root holding payloads/, tokens/ and rules/")
	brand := flags.String("brand", "scania", "brand mode to emit")
	_ = flags.Parse(args)
	if err := writeTokenArtifacts(*root, *brand); err != nil {
		fmt.Fprintln(os.Stderr, err)
		return 2
	}
	return 0
}

func writeTokenArtifacts(root, brand string) error {
	css, ruleData, err := tokenArtifacts(filepath.Join(root, "payloads", tokensPayload), brand)
	if err != nil {
		return err
	}
	cssPath := filepath.Join(root, "tokens", brand+".css")
	rulesPath := filepath.Join(root, "rules", "ruledata.json")
	if err := writeFile(cssPath, []byte(css)); err != nil {
		return err
	}
	if err := writeFile(rulesPath, ruleData); err != nil {
		return err
	}
	// The gate loads this file at startup and rejects an invalid one; fail here instead.
	if _, err := hardgate.LoadRuleDataSetFrom(rulesPath); err != nil {
		return fmt.Errorf("tokens: generated rule data is invalid: %w", err)
	}
	return nil
}

// tokenArtifacts returns the token stylesheet and the extended rule data for one brand.
func tokenArtifacts(tokensPath, brand string) (string, []byte, error) {
	var vars contracts.FigmaVariableCollection
	if err := readJSON(tokensPath, &vars); err != nil {
		return "", nil, err
	}
	tokens, err := deriveTokens(vars, brand)
	if err != nil {
		return "", nil, err
	}
	css, err := emitWebTokens(tokens)
	if err != nil {
		return "", nil, err
	}
	ruleData, err := extendRuleData(pipelinecontracts.RuleDataSetV2JSON, tokens.DefinedTokenNames())
	return css, ruleData, err
}

func deriveTokens(vars contracts.FigmaVariableCollection, brand string) (domain.DesignTokens, error) {
	tokens, rejected, err := domain.DeriveDesignTokens(vars, brand)
	if err != nil {
		return domain.DesignTokens{}, fmt.Errorf("tokens: derive: %w", err)
	}
	if len(rejected) > 0 {
		return domain.DesignTokens{}, fmt.Errorf("tokens: %d variables did not bind for %s: %+v", len(rejected), brand, rejected)
	}
	return tokens, nil
}

func emitWebTokens(tokens domain.DesignTokens) (string, error) {
	binding, ok := resolve.BindingFor(domain.TargetWeb)
	if !ok {
		return "", fmt.Errorf("tokens: backbone has no %q binding", domain.TargetWeb)
	}
	return binding.EmitTokenSource(tokens), nil
}

// ruleDataFile keeps every section but the token sets as raw JSON, so the generated
// file changes BOB's data only by the one set it adds.
type ruleDataFile struct {
	Version    json.RawMessage     `json:"version"`
	Thresholds json.RawMessage     `json:"thresholds"`
	TokenSets  []hardgate.TokenSet `json:"tokenSets"`
	TokenUsage json.RawMessage     `json:"tokenUsage"`
}

// extendRuleData adds a tegel token set holding each defined token that no existing set
// already names. Names arrive canonical (color/text/strong) and are stored as BOB stores
// them (--color-text-strong).
func extendRuleData(base []byte, defined []string) ([]byte, error) {
	var file ruleDataFile
	if err := json.Unmarshal(base, &file); err != nil {
		return nil, fmt.Errorf("tokens: parse base rule data: %w", err)
	}
	known := map[string]bool{}
	for _, set := range file.TokenSets {
		for name := range set.ValidTokens {
			known[name] = true
		}
	}
	added := map[string]bool{}
	for _, name := range defined {
		key := "--" + domain.ToKebab(name)
		if !known[key] {
			added[key] = true
		}
	}
	if len(added) > 0 {
		file.TokenSets = append(file.TokenSets, hardgate.TokenSet{Name: tegelTokenSet, ValidTokens: added})
	}
	out, err := json.MarshalIndent(file, "", "  ")
	if err != nil {
		return nil, fmt.Errorf("tokens: encode rule data: %w", err)
	}
	return append(out, '\n'), nil
}

func writeFile(path string, data []byte) error {
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return fmt.Errorf("tokens: create %s: %w", filepath.Dir(path), err)
	}
	if err := os.WriteFile(path, data, 0o644); err != nil {
		return fmt.Errorf("tokens: write %s: %w", path, err)
	}
	return nil
}
