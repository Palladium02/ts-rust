import { Clone } from '../clone/Clone';
import { Ord } from '../cmp/Ord';
import { PartialEq } from '../cmp/PartialEq';
import { PartialOrd } from '../cmp/PartialOrd';
import { Default } from '../default/Default';
declare global {
    interface Number extends Clone<number>, PartialEq<number>, PartialOrd<number>, Ord<number>, Default<number> {
    }
}
