import { Clone } from '../clone/Clone';
import { Ord } from '../cmp/Ord';
import { PartialEq } from '../cmp/PartialEq';
import { PartialOrd } from '../cmp/PartialOrd';
declare global {
    interface String extends Clone<string>, PartialEq<string>, PartialOrd<string>, Ord<string> {
    }
}
