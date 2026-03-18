Run a full internal linking audit. Do ALL of the following automatically without asking:

1. Run `python crawl_and_summarize.py` to get fresh internal link data.

2. Read merryfair_content_map.json.

3. The site has a sidebar "Read More" section that links to recent posts from every page. These are NOT contextual links. Identify sidebar links by finding slugs that appear as outbound links from 20+ posts — these are sitewide, not editorial. Exclude them from the analysis.

4. For each cluster, check:
   - Does the pillar link out to ALL cluster posts (contextually, not via sidebar)?
   - Does each cluster post link back to the pillar?
   - Are there any orphan posts (zero contextual inbound links)?
   - Are there cross-cluster links that make sense (health posts linking to buying guide, etc.)?

5. Generate a specific action list: "Add a link FROM [post A] TO [post B] because [reason]."

6. After any links are confirmed added, copy merryfair_content_map.json to visual-map/public/merryfair_content_map.json so the visual map reflects updated link data.

7. Print the full report with action items grouped by cluster.
