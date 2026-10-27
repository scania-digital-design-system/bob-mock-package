package main

import (
	"os"
	"path/filepath"
	"reflect"
	"sort"
	"strings"
	"testing"

	"traton-contracts"
)

func TestPublicAPISurface(t *testing.T) {
	tests := []struct {
		name    string
		markup  string
		want    []string
		wantErr bool
	}{
		{"plain props", "function Badge({ value, size }) { return null; }", []string{"value", "size"}, false},
		{"defaults", "function Badge({ value, size = 'lg' }) {}", []string{"value", "size"}, false},
		{"a default holding a comma", "function A({ label = 'a, b', size }) {}", []string{"label", "size"}, false},
		{"a default holding braces", "function A({ onClick = () => {}, size }) {}", []string{"onClick", "size"}, false},
		{"a renamed prop keeps its key", "function A({ variant: kind }) {}", []string{"variant"}, false},
		{"a rest element is skipped", "function A({ size, ...rest }) {}", []string{"size"}, false},
		{"multi-line props", "function A({\n  header,\n  subheader,\n}) {}", []string{"header", "subheader"}, false},
		{"no destructuring", "function A(props) {}", nil, true},
		{"an export first", "export default function A({ size }) {}", nil, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := publicAPISurface(tt.markup)
			if (err != nil) != tt.wantErr {
				t.Fatalf("publicAPISurface error = %v, wantErr %v", err, tt.wantErr)
			}
			if !tt.wantErr && !reflect.DeepEqual(got, tt.want) {
				t.Errorf("publicAPISurface = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestDeliveryCellRefuses(t *testing.T) {
	base := func() contracts.PublishRequest {
		req, err := loadRequest(filepath.Join("testdata", "payloads", "badge.json"))
		if err != nil {
			t.Fatalf("loadRequest: %v", err)
		}
		return req
	}
	c := cell{Brand: "scania", Target: "react", Markup: "function Badge({ size }) {}"}
	tests := []struct {
		name   string
		mutate func(*contracts.PublishRequest)
		want   string
	}{
		{"another component", func(r *contracts.PublishRequest) { r.Component = "card" }, `not "badge"`},
		{"a missing brand", func(r *contracts.PublishRequest) { r.Brands = []string{"traton"} }, `do not include "scania"`},
		{"a missing target", func(r *contracts.PublishRequest) { r.Targets = []string{"web"} }, `do not include "react"`},
		{"an unanswered variant axis", func(r *contracts.PublishRequest) { r.Surface.Answers = nil }, "unresolved surface properties [size]"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := base()
			tt.mutate(&req)
			_, err := deliveryCell(c, req, "badge")
			if err == nil || !strings.Contains(err.Error(), tt.want) {
				t.Errorf("deliveryCell error = %v, want it to contain %q", err, tt.want)
			}
		})
	}
}

func listFiles(t *testing.T, dir string) []string {
	t.Helper()
	entries, err := os.ReadDir(dir)
	if err != nil {
		t.Fatalf("read %s: %v", dir, err)
	}
	names := []string{}
	for _, e := range entries {
		// Hidden entries (an editor's or agent's .claude/, .DS_Store) are not cell files.
		if strings.HasPrefix(e.Name(), ".") {
			continue
		}
		names = append(names, e.Name())
	}
	sort.Strings(names)
	return names
}

func TestDeliverCellWritesBOBCell(t *testing.T) {
	out := t.TempDir()
	dir := filepath.Join("testdata", "cells", "react", "badge", "scania", "v1")
	if err := deliverCell("testdata", dir, out); err != nil {
		t.Fatalf("deliverCell: %v", err)
	}
	written := filepath.Join(out, "react", "badge", "scania", "v1")
	wantFiles := []string{"a11y.json", "api.json", "component.css", "component.jsx", "metadata.json", "tokens.dtcg.json", "usage.jsx"}
	if got := listFiles(t, written); !reflect.DeepEqual(got, wantFiles) {
		t.Errorf("files = %v, want %v (a bootstrap cell has no tokens.js)", got, wantFiles)
	}
	tests := []struct {
		file string
		want string
	}{
		{"metadata.json", "{\n  \"cellID\": \"badge:scania:react:1\",\n  \"component\": \"badge\",\n  \"brand\": \"scania\",\n  \"target\": \"react\"\n}"},
		{"usage.jsx", "import Badge from './component';\n\nexport default function Example() {\n  return <Badge />;\n}\n"},
		{"component.jsx", "function Badge({ value, size = 'lg' }) {\n  return <span className={`tl-badge tl-badge--${size}`}>{value}</span>;\n}\n"},
	}
	for _, tt := range tests {
		t.Run(tt.file, func(t *testing.T) {
			got, err := os.ReadFile(filepath.Join(written, tt.file))
			if err != nil {
				t.Fatal(err)
			}
			if string(got) != tt.want {
				t.Errorf("%s = %q, want %q", tt.file, got, tt.want)
			}
		})
	}
	surface, err := readSurface(filepath.Join(written, "api.json"))
	if err != nil {
		t.Fatal(err)
	}
	if want := []string{"value", "size"}; !reflect.DeepEqual(surface, want) {
		t.Errorf("api.json publicApiSurface = %v, want %v", surface, want)
	}
}

// Every committed cell must hold exactly the files the cell command writes for it.
func TestCommittedCellsAreCurrent(t *testing.T) {
	root := ".."
	dirs, err := filepath.Glob(filepath.Join(root, cellGlob))
	if err != nil {
		t.Fatal(err)
	}
	for _, dir := range dirs {
		rel, _ := filepath.Rel(filepath.Join(root, "cells"), dir)
		t.Run(rel, func(t *testing.T) {
			out := t.TempDir()
			if err := deliverCell(root, dir, out); err != nil {
				t.Fatalf("deliverCell: %v", err)
			}
			generated := filepath.Join(out, rel)
			if got, want := listFiles(t, dir), listFiles(t, generated); !reflect.DeepEqual(got, want) {
				t.Fatalf("files = %v, want %v; run `npm run cell`", got, want)
			}
			for _, name := range listFiles(t, generated) {
				want, _ := os.ReadFile(filepath.Join(generated, name))
				got, _ := os.ReadFile(filepath.Join(dir, name))
				if string(got) != string(want) {
					t.Errorf("%s is stale; run `npm run cell`", name)
				}
			}
		})
	}
}
