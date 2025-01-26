function processHtml(html) {
  // Function to extract text from HTML
  const trimmedString = html.replace(/<\/?[^>]+(>|$)/g, "");
  const first50Words = trimmedString.split(/\s+/).slice(0, 50);
  const resultString = first50Words.join(" ");
  return resultString;
}

function extractImageUrls(html) {
  // Function to extract image URLs from HTML
  const regex = /<img .*?src=['"](.*?)['"].*?>/g;
  const matches = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

module.exports = { processHtml, extractImageUrls };
