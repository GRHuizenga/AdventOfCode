export class Mathematics {
  public static gcd = (a: number, b: number): number =>
    b === 0 ? a : Mathematics.gcd(b, a % b);

  public static lcm = (a: number, b: number): number =>
    (a * b) / Mathematics.gcd(a, b);

  /**
   * Implementation of the shoelace algorithm to find the area of a polygon via the points on it's boundary
   * see: https://en.wikipedia.org/wiki/Shoelace_formula
   *
   * @param points a list of ordered (clockwise) points of a polygon
   * @returns the area of the polygon
   */
  public static shoelace = (points: { x: number; y: number }[]): number =>
    Math.abs(
      [...points, points.slice(0, 1)[0]] // close the loop by repeating the first point at the end
        .slidingWindow(2)
        .map(
          (pair: { x: number; y: number }[]) =>
            pair[0].x * pair[1].y - pair[0].y * pair[1].x
        )
        .sum(0)
    ) / 2;

  /**
   * Implementation of Prick's theorem.
   * see: https://en.wikipedia.org/wiki/Pick's_theorem
   *
   * @param numBoundaryPoints number of points on the boundary of the polygon
   * @param area the area of the polygon
   * @returns the number of points inside the polygon, excluding the boundary points
   */
  public static prick = (numBoundaryPoints: number, area: number): number =>
    area - (numBoundaryPoints / 2 - 1);

  /**
   * Calculates the shortest distance (eucledian distance) between 2 2D points.
   *
   * @param p1 point 1 in the x-y plane
   * @param p2 point 2 in the x-y plane
   * @returns euclidean distance between te points (shortest path over the grid)
   */
  public static euclideanDistance = (
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ): number =>
    Math.max(p1.x, p2.x) -
    Math.min(p1.x, p2.x) +
    (Math.max(p1.y, p2.y) - Math.min(p1.y, p2.y));
}
