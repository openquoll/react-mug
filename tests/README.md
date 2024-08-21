## Principles for Writing Tests

1. Tests should reflect various use cases that are useful in the user perspective. Don't chase coverage by writing useless tests.
2. Each test case should be independently executable so that the relevant code can be further debugged easily.
3. Try to explicitly declare the citations of the approximate scope of the dependent tests to reduce code duplication and raise cognition speed.
4. To cover a scope, just write a common test case group in the most thorough way, then stem from it for the missing test case groups.
