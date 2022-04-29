// An example of ConfigObject Namespaces and Partial Registration
import { registerAs } from '@nestjs/config';

export default registerAs('coffees', () => ({
  foo: 'bar',
}));
