
export function hitTestCircleCircle(c1, c2) {
  const vx = (c2.x + c2.radius) - (c1.x + c1.radius);
  const vy = (c2.y + c2.radius) - (c1.y + c1.radius);
  const magnitude = Math.sqrt((vx * vx) + (vy * vy));
  const combinedRadii = c1.radius + c2.radius;
  if (magnitude < combinedRadii) {
    let overlap = combinedRadii - magnitude;
    const padding = 0.3;
    overlap += padding;
    const dx = vx / magnitude;
    const dy = vy / magnitude;
    c1.x -= overlap * dx;
    c1.y -= overlap * dy;
  }
}

export function hitTestRectangleRectangle(r1, r2) {
  let collision;
  const r1HalfWidth = r1.halfWidth || r1.radius;
  const r1HalfHeight = r1.halfHeight || r1.radius;
  const r2HalfWidth = r2.halfWidth || r2.radius;
  const r2HalfHeight = r2.halfHeight || r2.radius;
  const vx = (r1.x + r1HalfWidth) - (r2.x + r2HalfWidth);
  const vy = (r1.y + r1HalfHeight) - (r2.y + r2HalfHeight);
  const combinedHalfWidths = r1HalfWidth + r2HalfWidth;
  const combinedHalfHeights = r1HalfHeight + r2HalfHeight;
  if (Math.abs(vx) < combinedHalfWidths) {
    if (Math.abs(vy) < combinedHalfHeights) {
      const overlapX = combinedHalfWidths - Math.abs(vx);
      const overlapY = combinedHalfHeights - Math.abs(vy);
      if (overlapX >= overlapY) {
        if (vy > 0) {
          collision = 'top';
          r1.y += overlapY;
        } else {
          collision = 'bottom';
          r1.y -= overlapY;
        }
      } else if (vx > 0) {
        collision = 'left';
        r1.x += overlapX;
      } else {
        collision = 'right';
        r1.x -= overlapX;
      }
    }
  }
  return collision;
}

export function hitTestCirclePoint(testee, notTestee, point, region) {
  let circle;
  let rectangle;
  let vx;
  let vy;
  if (testee.radius) {
    circle = testee;
    rectangle = notTestee;
  } else {
    circle = notTestee;
    rectangle = testee;
  }
  if (testee === circle) {
    vx = point.x - (circle.x);
    vy = point.y - (circle.y);
  } else {
    vx = (circle.x) - point.x;
    vy = (circle.y) - point.y;
  }
  const magnitude = Math.sqrt((vx * vx) + (vy * vy));
  if (magnitude < circle.radius) {
    const overlap = circle.radius - magnitude;
    const dx = vx / magnitude;
    const dy = vy / magnitude;
    testee.x -= overlap * dx;
    testee.y -= overlap * dy;
  }
}

export function hitTestCircleRectangleSide(shape1, shape2) {
  let collision,
    circle,
    rectangle,
    combinedHalfWidths,
    combinedHalfHeights,
    overlapX,
    overlapY,
    vx,
    vy;
  const testee = arguments[0];
  if (shape1.radius) {
    circle = shape1;
    rectangle = shape2;
  } else {
    circle = shape2;
    rectangle = shape1;
  }
  const circleHalfWidth = circle.radius;
  const circleHalfHeight = circle.radius;
  const rectangleHalfWidth = rectangle.halfWidth;
  const rectangleHalfHeight = rectangle.halfHeight;
  if (shape1 === circle) {
    vx = (circle.x) - (rectangle.x + rectangleHalfWidth);
    vy = (circle.y) - (rectangle.y + rectangleHalfHeight);
  } else {
    vx = (rectangle.x + rectangleHalfWidth) - (circle.x);
    vy = (rectangle.y + rectangleHalfHeight) - (circle.y);
  }
  combinedHalfWidths = circle.radius + rectangle.halfWidth;
  combinedHalfHeights = circle.radius + rectangle.halfHeight;
  if (Math.abs(vx) < combinedHalfWidths) {
    if (Math.abs(vy) < combinedHalfHeights) {
      overlapX = combinedHalfWidths - Math.abs(vx);
      overlapY = combinedHalfHeights - Math.abs(vy);
      if (overlapX >= overlapY) {
        if (vy > 0) {
          collision = 'top';
          testee.y += overlapY;
        } else {
          collision = 'bottom';
          testee.y -= overlapY;
        }
      } else if (vx > 0) {
        collision = 'left';
        testee.x += overlapX;
      } else {
        collision = 'right';
        testee.x -= overlapX;
      }
    }
  }
}

export function hitTestPlayerMapTile(player, mapTile) {
  const playerX = player.x;
  const playerY = circle.y;
  const rectangleX = rectangle.x;
  const rectangleY = rectangle.y;
  if (circleX < rectangleX && circleY < rectangleY) {
    region = 'topLeft';
  }
  if (circleX > rectangleX && circleY < rectangleY) {
    region = 'topMiddle';
  }
  if (circleX > (rectangleX + rectangle.width) && circleY < rectangleY) {
    region = 'topRight';
  }
  if (circleX < rectangleX && circleY > rectangleY && circleY < (rectangleY + rectangle.height)) {
    region = 'leftMiddle';
  }
  if (circleX > (rectangleX + rectangle.width) && circleY > rectangleY && circleY < (rectangleY + rectangle.height)) {
    region = 'rightMiddle';
  }
  if (circleX < rectangleX && circleY > (rectangleY + rectangle.height)) {
    region = 'bottomLeft';
  }
  if (circleX > rectangleX && circleX < (rectangleX + rectangle.width) && circleY > (rectangleY + rectangle.height)) {
    region = 'bottomMiddle';
  }
  if (circleX > (rectangleX + rectangle.width) && circleY > (rectangleY + rectangle.height)) {
    region = 'bottomRight';
  }
  if (region === 'topMiddle' ||
      region === 'bottomMiddle' ||
      region === 'leftMiddle' ||
      region === 'rightMiddle') {
    hitTestCircleRectangleSide(testee, notTestee);
  } else {
    const point = {};
    switch (region) {
      case 'topLeft':
        point.x = rectangleX;
        point.y = rectangleY;
        break;
      case 'topRight':
        point.x = rectangleX + rectangle.width;
        point.y = rectangleY;
        break;
      case 'bottomLeft':
        point.x = rectangleX;
        point.y = rectangleY + rectangle.height;
        break;
      case 'bottomRight':
        point.x = rectangleX + rectangle.width;
        point.y = rectangleY + rectangle.height;
        break;
      default:
        break;
    }
    hitTestCirclePoint(testee, notTestee, point, region);
  }
  console.clear();
  console.log('no collision');
}
