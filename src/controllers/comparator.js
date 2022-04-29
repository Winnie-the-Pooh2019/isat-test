export function compareTo(left, right) {
    if (left.averageMark === right.averageMark)
        return right.comments - left.comments;
    else
        return right.averageMark - left.averageMark;
}

export function sort(data) {
    return data.sort(compareTo)
}