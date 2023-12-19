function intersectionPoint2D(p1, p2, p3, p4) {
    const slope1 = (p2[2] - p1[2]) / (p2[0] - p1[0])
    const slope2 = (p4[2] - p3[2]) / (p4[0] - p3[0])

    // parallel lines
    if (slope1 === slope2) {
        return null
    }

    const b1 = p1[2] - slope1 * p1[0]
    const b2 = p3[2] - slope2 * p3[0]

    const x = (b2 - b1) / (slope1 - slope2)
    const y = slope1 * x + b1
    return [x, 0, y]
}

function ordinatePoints(p1, p2, p3, p4) {
    const arr = [p1, p2, p3, p4]
    arr.sort((a, b) => a[0] - b[0] || a[2] - b[2])

    const bottomLeft = arr[0]
    const bottomRight = arr[1][2] < arr[2][2] ? arr[1] : arr[2]
    const topLeft = arr[1][2] < arr[2][2] ? arr[2] : arr[1]
    const topRight = arr[3]

    return [topLeft, bottomLeft, topRight, bottomRight]
}

function hasIntersection(p1, p2, p3, p4) {
    const intersection = intersectionPoint2D(p1, p2, p3, p4)
    if (!intersection) {
        return false
    }


    const [topLeft, bottomLeft, topRight, bottomRight] = ordinatePoints(p1, p2, p3, p4)
    let slope, b

    // Check if the point is to the left of the left boundary
    slope = (topLeft[2] - bottomLeft[2]) / (topLeft[0] - bottomLeft[0])
    b = bottomLeft[2] - slope * bottomLeft[0]
    if (intersection[0] <= (intersection[2] - b) / slope) {
        return false
    }

    // Check if the point is to the right of the right boundary
    slope = (topRight[2] - bottomRight[2]) / (topRight[0] - bottomRight[0])
    b = bottomRight[2] - slope * bottomRight[0]
    if (intersection[0] >= (intersection[2] - b) / slope) {
        return false
    }

    // Check if the point is above the top boundary
    slope = (topRight[2] - topLeft[2]) / (topRight[0] - topLeft[0])
    b = topLeft[2] - slope * topLeft[0]
    if (intersection[2] >= slope * intersection[0] + b) {
        return false
    }

    // Check if the point is below the bottom boundary
    slope = (bottomRight[2] - bottomLeft[2]) / (bottomRight[0] - bottomLeft[0])
    b = bottomLeft[2] - slope * bottomLeft[0]
    if (intersection[2] <= slope * intersection[0] + b) {
        return false
    }
    console.log(intersection)
    return true
}

export { hasIntersection }