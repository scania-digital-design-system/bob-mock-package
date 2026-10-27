package main

import (
	"bytes"
	"path/filepath"
	"reflect"
	"sort"
	"strings"
	"testing"

	"traton-contracts"
	"traton-design-system-poc/src/adapter/hardgate"
	"traton-design-system-poc/src/domain"
)

const fixtureMarkup = "function Badge({ tone }) {\n  return <span className={`tl-badge tl-badge--${tone}`}>1</span>;\n}"

const fixtureStyles = `.tl-badge { background-color: var(--color-primary-default); padding: var(--space-inset-sm); }
.tl-badge--loud { color: var(--color-on-primary); }
.tl-badge--quiet { color: var(--color-text-primary); }
`

func fixtureRequest() contracts.PublishRequest {
	color := func(name, hex string) contracts.FigmaVariable {
		return contracts.FigmaVariable{Name: name, Type: "COLOR", ValuesByMode: map[string]string{"scania": hex}}
	}
	return contracts.PublishRequest{
		Component: "badge",
		Brands:    []string{"scania"},
		Targets:   []string{"react"},
		Variables: contracts.FigmaVariableCollection{Variables: []contracts.FigmaVariable{
			color("color/primary/default", "#d1001b"),
			color("color/on-primary", "#ffffff"),
			color("color/text/primary", "#0e1013"),
			{Name: "space/inset/sm", Type: "FLOAT", ValuesByMode: map[string]string{"scania": "8"}},
		}},
		Surface: contracts.ComponentSurface{Properties: []contracts.ComponentProperty{
			{Name: "tone", Type: "VARIANT", Values: []string{"loud", "quiet"}},
		}},
	}
}

func loadRules(t *testing.T) *hardgate.RuleDataSet {
	t.Helper()
	rules, err := hardgate.LoadRuleDataSetFrom(filepath.Join("..", "rules", "ruledata.json"))
	if err != nil {
		t.Fatalf("load rules: %v", err)
	}
	return rules
}

// failedRules lists one rule ID per finding, sorted. Duplicates are kept: token
// closure reuses the membership check, so both report as "token-set" and only the
// count tells them apart.
func failedRules(r domain.HardGateResult) []string {
	rules := make([]string, 0, len(r.Failures))
	for _, f := range r.Failures {
		rules = append(rules, f.Rule)
	}
	sort.Strings(rules)
	return rules
}

func TestRealGateOverCell(t *testing.T) {
	rules := loadRules(t)
	tests := []struct {
		name      string
		markup    string
		styles    string
		surface   []string
		wantRules []string
	}{
		{"conforming cell passes", fixtureMarkup, fixtureStyles, []string{"tone"}, []string{}},
		{"modifier without a rule fails class closure", fixtureMarkup,
			strings.Replace(fixtureStyles, ".tl-badge--quiet", ".tl-badge--other", 1), []string{"tone"}, []string{"class-closure"}},
		{"token outside the vocabulary fails membership and closure", fixtureMarkup,
			fixtureStyles + ".tl-badge { outline-color: var(--color-invented); }\n", []string{"tone"}, []string{"token-set", "token-set"}},
		{"vocabulary token the brand does not define fails closure only", fixtureMarkup,
			fixtureStyles + ".tl-badge { outline-color: var(--color-danger); }\n", []string{"tone"}, []string{"token-set"}},
		{"a local custom property fails membership and closure", fixtureMarkup,
			fixtureStyles + ".tl-badge--loud { --tone: var(--color-on-primary); color: var(--tone); }\n", []string{"tone"}, []string{"token-set", "token-set"}},
		{"space token on width fails token usage", fixtureMarkup,
			fixtureStyles + ".tl-badge { width: var(--space-inset-sm); }\n", []string{"tone"}, []string{"token-usage"}},
		{"interpolating an undeclared name fails class closure",
			strings.Replace(fixtureMarkup, "${tone}", "${size}", 1), fixtureStyles, []string{"tone"}, []string{"class-closure"}},
		{"surface entry with whitespace fails API form", fixtureMarkup, fixtureStyles, []string{"to ne"}, []string{"api-surface-form"}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			c := cell{Brand: "scania", Target: "react", Markup: tt.markup, Styles: tt.styles, PublicAPISurface: tt.surface}
			art, err := artifact(c, fixtureRequest())
			if err != nil {
				t.Fatalf("artifact: %v", err)
			}
			got := failedRules(hardgate.RunHardGates(art, rules))
			if !reflect.DeepEqual(got, tt.wantRules) {
				t.Errorf("failed rules = %v, want %v", got, tt.wantRules)
			}
		})
	}
}

func TestArtifactRejectsUnboundBrand(t *testing.T) {
	c := cell{Brand: "traton", Target: "react", Markup: fixtureMarkup}
	if _, err := artifact(c, fixtureRequest()); err == nil {
		t.Fatal("artifact for a brand with no values = nil error, want rejection")
	}
}

func TestSplitCellPath(t *testing.T) {
	tests := []struct {
		rel                      string
		target, component, brand string
	}{
		{filepath.Join("react", "badge", "scania", "v1"), "react", "badge", "scania"},
		{filepath.Join("angular", "card", "scania", "v2"), "angular", "card", "scania"},
	}
	for _, tt := range tests {
		t.Run(tt.rel, func(t *testing.T) {
			target, component, brand := splitCellPath(tt.rel)
			if target != tt.target || component != tt.component || brand != tt.brand {
				t.Errorf("splitCellPath(%q) = %q, %q, %q", tt.rel, target, component, brand)
			}
		})
	}
}

func TestLoadRequestMergesSharedTokens(t *testing.T) {
	tests := []struct {
		name      string
		payload   string
		wantNames []string
	}{
		{"payload without variables takes _tokens.json", "shared.json", []string{"color/primary/default"}},
		{"payload with variables keeps its own", "own.json", []string{"color/on-primary"}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req, err := loadRequest(filepath.Join("testdata", "payloads", tt.payload))
			if err != nil {
				t.Fatalf("loadRequest: %v", err)
			}
			var got []string
			for _, v := range req.Variables.Variables {
				got = append(got, v.Name)
			}
			if !reflect.DeepEqual(got, tt.wantNames) {
				t.Errorf("variables = %v, want %v", got, tt.wantNames)
			}
		})
	}
}

func TestReport(t *testing.T) {
	tests := []struct {
		name     string
		verdicts []verdict
		wantPass bool
		wantOut  string
	}{
		{"all pass", []verdict{{ID: "react/badge/scania/v1", Result: domain.NewHardGateResult()}}, true,
			"PASS react/badge/scania/v1\n1 cell(s) gated\n"},
		{"one finding", []verdict{{ID: "react/badge/scania/v1", Result: domain.NewHardGateResult(domain.GateFinding{Rule: "token-set", Detail: "x"})}}, false,
			"FAIL react/badge/scania/v1\n  - [token-set] x\n1 cell(s) gated\n"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var out bytes.Buffer
			if got := report(&out, tt.verdicts); got != tt.wantPass {
				t.Errorf("report pass = %v, want %v", got, tt.wantPass)
			}
			if out.String() != tt.wantOut {
				t.Errorf("report output = %q, want %q", out.String(), tt.wantOut)
			}
		})
	}
}
