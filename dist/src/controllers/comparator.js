"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sort = exports.compareTo = void 0;
function compareTo(left, right) {
    if (left.averageMark === right.averageMark)
        return right.comments - left.comments;
    else
        return right.averageMark - left.averageMark;
}
exports.compareTo = compareTo;
function sort(data) {
    return data.sort(compareTo);
}
exports.sort = sort;
//# sourceMappingURL=comparator.js.map