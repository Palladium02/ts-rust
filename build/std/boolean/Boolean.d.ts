import { Clone } from '../clone/Clone';
import { Ord } from '../cmp/Ord';
import { PartialEq } from '../cmp/PartialEq';
import { PartialOrd } from '../cmp/PartialOrd';
declare global {
    interface Boolean extends Clone<boolean>, PartialEq<boolean>, PartialOrd<boolean>, Ord<boolean> {
    }
}
