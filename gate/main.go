// Command gate runs the backbone's real hard gate over every hand-written cell in
// this repo (ADR 0002 D5). It exits non-zero when any cell has a finding.
//
//	go run . -root ..
package main

import (
	"flag"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sort"

	"traton-design-system-poc/src/adapter/hardgate"
	"traton-design-system-poc/src/domain"
)

// cellGlob matches cells/<target>/<component>/<brand>/v<n>.
const cellGlob = "cells/*/*/*/v*"

type verdict struct {
	ID     string
	Result domain.HardGateResult
}

func main() {
	root := flag.String("root", "..", "repo root holding cells/, payloads/ and rules/")
	rulesPath := flag.String("rules", "", "rule data file (default <root>/rules/ruledata.json)")
	flag.Parse()
	if *rulesPath == "" {
		*rulesPath = filepath.Join(*root, "rules", "ruledata.json")
	}
	verdicts, err := run(*root, *rulesPath)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(2)
	}
	if !report(os.Stdout, verdicts) {
		os.Exit(1)
	}
}

func run(root, rulesPath string) ([]verdict, error) {
	rules, err := hardgate.LoadRuleDataSetFrom(rulesPath)
	if err != nil {
		return nil, err
	}
	dirs, err := filepath.Glob(filepath.Join(root, cellGlob))
	if err != nil {
		return nil, fmt.Errorf("gate: find cells: %w", err)
	}
	sort.Strings(dirs)
	verdicts := make([]verdict, 0, len(dirs))
	for _, dir := range dirs {
		v, err := gateCell(root, dir, rules)
		if err != nil {
			return nil, err
		}
		verdicts = append(verdicts, v)
	}
	return verdicts, nil
}

func gateCell(root, dir string, rules *hardgate.RuleDataSet) (verdict, error) {
	rel, err := filepath.Rel(filepath.Join(root, "cells"), dir)
	if err != nil {
		return verdict{}, fmt.Errorf("gate: locate %s: %w", dir, err)
	}
	target, component, brand := splitCellPath(rel)
	c, err := loadCell(dir, brand, target)
	if err != nil {
		return verdict{}, fmt.Errorf("gate: %s: %w", rel, err)
	}
	req, err := loadRequest(filepath.Join(root, "payloads", component+".json"))
	if err != nil {
		return verdict{}, fmt.Errorf("gate: %s: %w", rel, err)
	}
	art, err := artifact(c, req)
	if err != nil {
		return verdict{}, fmt.Errorf("gate: %s: %w", rel, err)
	}
	return verdict{ID: filepath.ToSlash(rel), Result: hardgate.RunHardGates(art, rules)}, nil
}

// splitCellPath reads target, component and brand out of <target>/<component>/<brand>/v<n>.
func splitCellPath(rel string) (target, component, brand string) {
	brandDir := filepath.Dir(rel)
	componentDir := filepath.Dir(brandDir)
	return filepath.Dir(componentDir), filepath.Base(componentDir), filepath.Base(brandDir)
}

// report prints one line per cell and one indented line per finding, and says
// whether every cell passed.
func report(w io.Writer, verdicts []verdict) bool {
	pass := true
	for _, v := range verdicts {
		if v.Result.Pass {
			fmt.Fprintf(w, "PASS %s\n", v.ID)
			continue
		}
		pass = false
		fmt.Fprintf(w, "FAIL %s\n", v.ID)
		for _, f := range v.Result.Failures {
			fmt.Fprintf(w, "  - [%s] %s\n", f.Rule, f.Detail)
		}
	}
	fmt.Fprintf(w, "%d cell(s) gated\n", len(verdicts))
	return pass
}
