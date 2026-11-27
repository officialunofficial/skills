# Types, errors, protocols, API design and macros

## Contents

- Value types and copy-on-write
- Noncopyable types
- Errors and optionals
- Protocols and generics
- some and any
- API design
- Macros

## Value types and copy-on-write

- A struct whose stored properties are all value types has value semantics for free. Undo, diffing and state restoration then need one code path, not one per property.
- Copy-on-write gives out-of-line storage with value semantics. Wrap a final class in a struct. Before a mutation, call `isKnownUniquelyReferenced(&storage)` and copy if it returns false. `Array`, `String` and `Dictionary` work this way.

```swift
struct Material {
  var roughness: Double
  private var _texture: Texture         // a class

  var color: Color {
    get { _texture.color }
    set {
      if !isKnownUniquelyReferenced(&_texture) { _texture = Texture(copying: _texture) }
      _texture.color = newValue
    }
  }
}
```

## Noncopyable types

`~Copyable` expresses unique ownership: a file descriptor, a bank transfer, an open resource. "Do not run this twice" becomes a compile error, and `deinit` on a struct has meaning.

- Mark the method that finishes the value `consuming`. The compiler then proves it is the last use.
- State parameter ownership: `borrowing` (read only, the default), `consuming` (takes the value), `inout` or `mutating` (temporary write access).

## Errors and optionals

- Make error types enums with associated values. `case duplicateFriend(String)` carries the context a handler needs.
- Use `guard` for an error condition, because it forces the exit. Use `if let` for an ordinary unwrap.
- Use typed throws (`throws(MyError)`) for internal functions, generic code that forwards errors, and environments where a boxed `any Error` costs too much. Public API uses untyped `throws`, so you can change the error type later.
- `throws` means `throws(any Error)`, and a non-throwing function means `throws(Never)`. That is how `map` abstracts over both.
- Force-unwrap only where you can state the invariant. A `precondition` or `#require` with a message is better than a bare `!`.
- An index out of bounds halts the program on purpose, before the bug becomes a security issue.

## Protocols and generics

Overloads with almost the same body are the signal to generalize.

- A protocol where every conformance uses the same default implementation is wasted. Write a constrained extension on an existing protocol. Deep protocol hierarchies cost compile time and binary size.
- Prefer has-a to is-a. If only some operations of a protocol suit your type, wrap the type in a generic struct and expose the API you mean: `GeometricVector<Storage: SIMD>`, not `GeometricVector: SIMD`.
- A protocol requirement is a customization point with dynamic dispatch. The implementation of the conformer wins everywhere. For a method only in an extension, code that knows `any P` calls the extension version.
- Class inheritance allows one superclass, pulls in stored properties and initializer rules, and leaves unwritten contracts about overrides and calls to `super`. Compose small values.
- A forced downcast means a class hierarchy or an existential lost a type relationship.

## some and any

- `some P` is one fixed type per scope. You keep every type relationship, including associated types, and the compiler can specialize.
- `any P` is a type-erased box whose type varies at run time. Use it for mixed collections, for an optional underlying type, or to hide the abstraction. The cost: associated types erase to their upper bounds, and the optimizer cannot see through calls.
- You cannot call a method that takes an associated type on an `any P`. Erasure works for results, not for arguments. Pass the existential to a function that takes `some P`. The compiler opens the box, and the type is fixed inside that scope.
- Constrained forms such as `some Collection<Element>` and `any Collection<any Animal>` hide a type like `LazyFilterSequence<[Animal]>` and still expose the element type.
- Declare a primary associated type on your protocol (`protocol Container<Item>`) for the type callers supply, not for a detail such as `Iterator`.
- Use same-type requirements in `where` clauses to fix relationships across protocols: `where Self.CropType.FeedType == Self`. Without them, wrong conformances compile.

## API design

Clarity at the point of use is the goal above the others.

- Swift-only APIs take no type prefix, because modules disambiguate. Keep a prefix only where the API mirrors an Objective-C one. Avoid very general names in a specific framework.
- Drop a leading `get`: `persistentPosts`, not `getPersistentPosts`.
- Access control is documentation: `private`, `internal` (the default), `package`, `public`. An explicit boundary forces the decisions about sendability and API evolution.
- Make illegal states impossible to write: private setters with a mutating method that validates, enums for closed sets, a typed `UUID` in place of a `String`.
- A property wrapper extracts an access policy, such as `@Argument`, `@Published`, a defensive copy or lazy storage, so the declaration states the policy in one word. Add `@dynamicMemberLookup` on a key path to project through a wrapper. `$binding.title` works this way.
- Use a result builder for a declarative DSL.

## Macros

Use a macro only for code the compiler could derive.

- The compiler type-checks macro arguments against the declared signature before expansion. Misuse is a clear error at the call site.
- A freestanding macro (`#foo`) produces an expression or a declaration. An attached macro (`@Foo`) adds to a declaration in one of five roles: member, peer, accessor, member-attribute, conformance. Roles combine: `@Observable` is member, member-attribute and conformance.
- Test a macro as a syntax tree transform with `assertMacroExpansion`. To learn the shape of a node, set a breakpoint in `expansion` and `po` the node.
- When the macro does not apply, emit a diagnostic. Throw an error, or call `context.addDiagnostic` for a warning or a fix-it at a location. A macro must not generate code that fails to compile with no explanation.
- Expanded code is ordinary Swift. You can view it with Expand Macro and step through it in the debugger.
