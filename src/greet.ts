import { Person } from './person';

export function  greeter(person: Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}
