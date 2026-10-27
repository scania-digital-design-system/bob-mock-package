module bob-mock-tools

go 1.26.0

require (
	traton-contracts v0.0.0
	traton-design-system-poc v0.0.0
)

// Every command runs the backbone's own code, read from the sibling checkout (ADRs 0002
// D5, 0003 D1). Whatever ref ../brand-orchestration-backbone has checked out is what we run.
replace (
	traton-contracts => ../../brand-orchestration-backbone/contracts
	traton-design-system-poc => ../../brand-orchestration-backbone/pipeline
)
