// greet :: string -> string
type Greet = (arg0: string) => string
const greet: Greet = name => `Hello ${name}!`

// sum :: number -> number -> number
type Sum = (arg0: number) => (arg1: number) => number
const sum: Sum = x => y => x + y
