// Command bob runs the backbone's own Go code over this repo (ADRs 0002, 0003):
//
//	go run . gate   -root ..   run the real hard gate over every cell
//	go run . tokens -root ..   emit tokens/scania.css and rules/ruledata.json
//
// It never runs the pipeline: no Temporal, no LLM, no network.
package main

import (
	"fmt"
	"os"
)

const usage = "usage: bob <gate|tokens> [-root dir]"

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintln(os.Stderr, usage)
		os.Exit(2)
	}
	commands := map[string]func([]string) int{
		"gate":   gateCommand,
		"tokens": tokensCommand,
	}
	command, ok := commands[os.Args[1]]
	if !ok {
		fmt.Fprintln(os.Stderr, usage)
		os.Exit(2)
	}
	os.Exit(command(os.Args[2:]))
}
