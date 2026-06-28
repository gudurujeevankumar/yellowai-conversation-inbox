const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  const client = await page.target().createCDPSession();
  await client.send('DOM.enable');
  await client.send('CSS.enable');

  const doc = await client.send('DOM.getDocument');

  // Find QueueStatistics container by its classes
  const queueStatsNode = await client.send('DOM.querySelector', {
    nodeId: doc.root.nodeId,
    selector: '.pt-6.pb-6.px-4.border-b.shrink-0'
  });

  // Find a StatCard
  const statCardNode = await client.send('DOM.querySelector', {
    nodeId: doc.root.nodeId,
    selector: '.p-4.rounded-xl.border'
  });

  async function inspectNode(name, nodeId) {
    console.log(`\n=== Inspecting ${name} ===`);
    
    // Get computed styles
    const computed = await client.send('CSS.getComputedStyleForNode', { nodeId });
    const paddingLeft = computed.computedStyle.find(s => s.name === 'padding-left');
    console.log(`1. Computed padding-left: ${paddingLeft.value}`);

    // Get matched styles
    const styles = await client.send('CSS.getMatchedStylesForNode', { nodeId });
    
    let paddingRules = [];
    
    for (const match of styles.matchedCSSRules) {
      for (const prop of match.rule.style.cssProperties) {
        if (prop.name === 'padding' || prop.name === 'padding-left' || prop.name === 'padding-inline') {
          paddingRules.push({
            selector: match.rule.selectorList.text,
            text: `${prop.name}: ${prop.value}`,
            source: match.rule.style.styleSheetId ? 'external stylesheet' : 'inline',
            url: match.rule.styleSheetId ? (await client.send('CSS.getStyleSheetText', { styleSheetId: match.rule.styleSheetId })).text.slice(0,0) + "stylesheet" : "",
            isCrossedOut: false // We determine this by order
          });
        }
      }
    }
    
    // The CDP returns rules in order of precedence: lowest to highest? No, usually highest to lowest or based on cascade.
    // Actually, matchedCSSRules are returned in ascending order of precedence. The LAST rule matching a property wins.
    // Let's just print all the matched padding rules to show the cascade.
    console.log(`\nMatched CSS Rules for padding (in order of application, later rules win unless overridden):`);
    styles.matchedCSSRules.forEach((match, index) => {
      const paddingProps = match.rule.style.cssProperties.filter(p => 
        p.name.includes('padding') || p.name === 'padding'
      );
      if (paddingProps.length > 0) {
        console.log(`- Rule [${index}]: Selector \`${match.rule.selectorList.text}\``);
        paddingProps.forEach(p => {
           console.log(`  └─ ${p.name}: ${p.value}`);
        });
      }
    });

  }

  await inspectNode('QueueStatistics Container', queueStatsNode.nodeId);
  await inspectNode('StatCard', statCardNode.nodeId);

  await browser.close();
})();
