package main

import (
	"os"
	"path/filepath"
	"reflect"
	"sort"
	"testing"

	"traton-contracts"
	pipelinecontracts "traton-design-system-poc/contracts"
	"traton-design-system-poc/src/adapter/hardgate"
)

func variable(name, kind, value string) contracts.FigmaVariable {
	return contracts.FigmaVariable{Name: name, Type: kind, ValuesByMode: map[string]string{"scania": value}}
}

// The cases pin BOB's emitter behaviour that docs/tokens.md relies on (ADR 0003 D4).
func TestEmitWebTokens(t *testing.T) {
	tests := []struct {
		name string
		vars []contracts.FigmaVariable
		want string
	}{
		{"a colour is emitted verbatim", []contracts.FigmaVariable{variable("color/text/strong", "COLOR", "#0e1013")},
			":root {\n  --color-text-strong: #0e1013;\n}\n"},
		{"a float always gets px", []contracts.FigmaVariable{variable("space/element/4", "FLOAT", "4")},
			":root {\n  --space-element-4: 4px;\n}\n"},
		{"a float opacity would break", []contracts.FigmaVariable{variable("opacity/disabled", "FLOAT", "0.25")},
			":root {\n  --opacity-disabled: 0.25px;\n}\n"},
		{"a colour carrier keeps a bare number", []contracts.FigmaVariable{variable("opacity/disabled", "COLOR", "0.25")},
			":root {\n  --opacity-disabled: 0.25;\n}\n"},
		{"a font family is emitted under its group", []contracts.FigmaVariable{variable("font/family/detail.fontFamily", "STRING", "arial")},
			":root {\n  --font-family-detail: arial;\n}\n"},
		{"a typography font size is not emitted", []contracts.FigmaVariable{variable("font/detail.fontSize", "FLOAT", "14")},
			":root {\n  --font-detail: ;\n}\n"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tokens, err := deriveTokens(contracts.FigmaVariableCollection{Variables: tt.vars}, "scania")
			if err != nil {
				t.Fatalf("deriveTokens: %v", err)
			}
			got, err := emitWebTokens(tokens)
			if err != nil {
				t.Fatalf("emitWebTokens: %v", err)
			}
			if got != tt.want {
				t.Errorf("emitWebTokens = %q, want %q", got, tt.want)
			}
		})
	}
}

func tegelSet(t *testing.T, ruleData []byte) []string {
	t.Helper()
	path := filepath.Join(t.TempDir(), "ruledata.json")
	if err := os.WriteFile(path, ruleData, 0o644); err != nil {
		t.Fatal(err)
	}
	rules, err := hardgate.LoadRuleDataSetFrom(path)
	if err != nil {
		t.Fatalf("generated rule data does not load: %v", err)
	}
	names := []string{}
	for _, set := range rules.TokenSets {
		if set.Name != tegelTokenSet {
			continue
		}
		for name := range set.ValidTokens {
			names = append(names, name)
		}
	}
	sort.Strings(names)
	return names
}

func TestExtendRuleData(t *testing.T) {
	tests := []struct {
		name    string
		defined []string
		want    []string
	}{
		{"new names are added in custom-property form", []string{"color/text/strong", "space/element/4"},
			[]string{"--color-text-strong", "--space-element-4"}},
		{"stock names are not repeated", []string{"radius/control", "color/text/strong"},
			[]string{"--color-text-strong"}},
		{"only stock names add no set", []string{"radius/control", "color/danger"}, []string{}},
		{"a font family group is added under its group name", []string{"font/family/detail"},
			[]string{"--font-family-detail"}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			out, err := extendRuleData(pipelinecontracts.RuleDataSetV2JSON, tt.defined)
			if err != nil {
				t.Fatalf("extendRuleData: %v", err)
			}
			if got := tegelSet(t, out); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("tegel set = %v, want %v", got, tt.want)
			}
		})
	}
}

// The committed tokens/scania.css and rules/ruledata.json must be what the tokens
// command produces from payloads/_tokens.json and the backbone checkout.
func TestCommittedTokenArtifactsAreCurrent(t *testing.T) {
	css, ruleData, err := tokenArtifacts(filepath.Join("..", "payloads", tokensPayload), "scania")
	if err != nil {
		t.Fatalf("tokenArtifacts: %v", err)
	}
	tests := []struct {
		path string
		want string
	}{
		{filepath.Join("..", "tokens", "scania.css"), css},
		{filepath.Join("..", "rules", "ruledata.json"), string(ruleData)},
	}
	for _, tt := range tests {
		t.Run(tt.path, func(t *testing.T) {
			got, err := os.ReadFile(tt.path)
			if err != nil {
				t.Fatalf("read: %v", err)
			}
			if string(got) != tt.want {
				t.Errorf("%s is stale; run `npm run tokens`", tt.path)
			}
		})
	}
}
