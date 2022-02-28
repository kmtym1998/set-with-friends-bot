// n ミリ秒処理を止める
function delay(n) {
  return new Promise(function (resolve) {
    setTimeout(resolve, n);
  });
}

// 組み合わせを列挙する (ary.length C n 通りの組み合わせ)
const combination = (ary, n) => {
  let ans = [];
  if (ary.length < n) {
    return [];
  }
  if (n === 1) {
    for (let i = 0; i < ary.length; i++) {
      ans[i] = [ary[i]];
    }
  } else {
    for (let i = 0; i < ary.length - n + 1; i++) {
      let row = combination(ary.slice(i + 1), n - 1);
      for (let j = 0; j < row.length; j++) {
        ans.push([ary[i]].concat(row[j]));
      }
    }
  }
  return ans;
};

// ユニーク or 全部一緒 のチェック
const check = (card0, card1, card2, key = '') => {
  // 全部一緒
  if (card0[key] === card1[key] && card1[key] === card2[key]) return true;
  // 全部異なる
  if (
    card0[key] !== card1[key] &&
    card1[key] !== card2[key] &&
    card2[key] !== card0[key]
  )
    return true;

  return false;
};

(async () => {
  for await (index of [...Array(1000)]) {
    const cardElements = document.getElementsByClassName(
      'MuiPaper-elevation1',
    )[1].children;

    const cards = [];

    for (const [_, node] of Object.entries(cardElements)) {
      if (node.tagName !== 'DIV') continue;
      if (node.style.visibility !== 'visible') continue;

      // 数 (1, 2, 3)
      const count = node.childNodes[0].childElementCount;

      // 形 (#squiggle, #diamond, #oval)
      const shape =
        node.childNodes[0].childNodes[0].childNodes[0].getAttribute('href');

      // 色 (#800080, #ff0101, #008002)
      const color =
        node.childNodes[0].childNodes[0].childNodes[1].getAttribute('stroke');

      // 塗りつぶし (transparent, solid, stripe)
      let paint = '';
      if (
        node.childNodes[0].childNodes[0].childNodes[0].getAttribute('fill') ===
        'transparent'
      ) {
        paint = 'transparent';
      } else if (
        node.childNodes[0].childNodes[0].childNodes[0].getAttribute('mask') ===
        'url(#mask-stripe)'
      ) {
        paint = 'stripe';
      } else if (
        node.childNodes[0].childNodes[0].childNodes[0]
          .getAttribute('fill')
          .startsWith('#')
      ) {
        paint = 'solid';
      } else {
        console.error('unknown paint method: \n', {
          count,
          shape,
          color,
          paint,
        });
      }

      // カードの HTML 要素
      const element = node.childNodes[0];

      cards.push({ count, shape, color, paint, element });
    }

    // 総組み合わせの配列: [[1,2,3], [1,2,4], [1,2,5] ... ]
    const combs = combination([...Array(cards.length).keys()], 3);

    const results = [];
    for (const comb of combs) {
      const card0 = cards[comb[0]];
      const card1 = cards[comb[1]];
      const card2 = cards[comb[2]];

      if (!check(card0, card1, card2, 'count')) continue;
      if (!check(card0, card1, card2, 'shape')) continue;
      if (!check(card0, card1, card2, 'color')) continue;
      if (!check(card0, card1, card2, 'paint')) continue;

      results.push(card0);
      results.push(card1);
      results.push(card2);

      break;
    }

    if (results.length === 0) break;

    results.forEach((r) => {
      r.element.click();
    });
    await delay(700);
  }
})();
