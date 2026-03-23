
function extractLinkAndText(str) {
  const linkRegex = /https?:\/\/[^\s]+/g;

  const links = str.match(linkRegex) || [];
  const text = str.replace(linkRegex, "").trim();

  return {
    links,
    text,
  };
}

module.exports = extractLinkAndText;