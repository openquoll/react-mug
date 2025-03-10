## Commit Conventions

- A commit is a continuous mental output.
- A commit message concisely states the main idea of the commit.

## Type Defining Conventions

- Every type and all its conditional results are explicitly declared and exported on file level to avoid TS4023 ("but cannot be named").
- On defining function types, function overloads are preferred over conditional types for better assignability.
