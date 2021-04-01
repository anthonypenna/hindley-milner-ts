// greet :: string -> string
type Greet = (arg0: string) => string
const greet: Greet = name => `Hello ${name}!`

// sum :: number -> number -> number
type Sum = (arg0: number) => (arg1: number) => number
const sum: Sum = x => y => x + y

// concat :: forall a. a -> a -> a
type Concat = <a>(arg0: a) => (arg1: a) => a
const concat = x => y => x + y
