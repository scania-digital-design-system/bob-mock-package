module bob-mock-gate

go 1.26.0

require (
	traton-contracts v0.0.0
	traton-design-system-poc v0.0.0
)

// The gate is the backbone's own code, read from the sibling checkout (ADR 0002 D5).
// Whatever ref ../brand-orchestration-backbone has checked out is the rule set we run.
replace (
	traton-contracts => ../../brand-orchestration-backbone/contracts
	traton-design-system-poc => ../../brand-orchestration-backbone/pipeline
)
