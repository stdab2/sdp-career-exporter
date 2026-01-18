chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.action === "export_job_offers") {
            try {
                const jobNodes = Array.from(
                    document.querySelectorAll('.row-fluid.boite.k-listview-item')
                );
                const jobs = jobNodes.map(job);
                const headers = Object.keys(jobs[0])
                sendResponse({status: 'success', headers, jobs})
            } catch (error) {
                sendResponse({status: "error"})
            }
            
            return true
        }
    }
)

const job = jobNode => {
  const titleLink = jobNode.querySelector('.offre-titre')

  const jobTitle = titleLink?.textContent.trim() ?? null
  const jobUrl = titleLink?.href ?? null

  const company = titleLink?.parentElement
    ?.textContent
    .replace(jobTitle ?? '', '')
    .trim() ?? null

  const city = jobNode.querySelector('.span6 .bold')
    ?.textContent.trim() ?? null

  const postedAgo = jobNode.querySelector('.span6 .muted')
    ?.textContent.trim() ?? null

  const companyLogo = jobNode.querySelector('img')
    ?.src ?? null

  return {
    "job_url": jobUrl,
    "job_title": jobTitle,
    "company": company,
    "company_logo": companyLogo,
    "city": city,
    "posted_ago": postedAgo,
  };
};
