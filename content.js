chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.action === "export_job_offers") {
            try {
                const jobNodes = Array.from(
                    document.querySelectorAll('.row-fluid.boite.k-listview-item')
                );
                let jobs = []
                if(request.isLikedOnly) {
                    jobs = jobNodes.filter(filterLikedOnly)
                } else {
                    jobs = jobNodes.map(job)
                }
                const headers = Object.keys(jobs[0])
                sendResponse({status: "success", headers, jobs})
            } catch (error) {
                sendResponse({status: "error", error: error.message})
            }
        } else if(request.action === "next") {
            next(sendResponse)
        } else if(request.action === "prev") {
            prev(sendResponse)
        } else {
            const pageNumberSection = Array.from(document.querySelectorAll('.k-pager-numbers'))[0]
            const activePageNumber =  pageNumberSection.querySelector('.k-link.k-state-selected').textContent
            const lastVisiblePage = Array.from(pageNumberSection.querySelectorAll('.k-link')).at(-1).textContent
            if(activePageNumber == "1") {
                sendResponse({status: "success", message: "We are at the first page"})
            } else if(activePageNumber === lastVisiblePage) {
                sendResponse({status: "success", message: "We are at the max page"})
            }
        }
        return true
    }
)


const filterLikedOnly = jobNode => {
    const isALikedJob = jobNode.querySelector('.k-icon.k-i-fav.icon-remove-favori')
    return !!isALikedJob
}

const next = sendResponse => {
    const navButtons = Array.from(document.querySelectorAll('.k-link.k-pager-nav'))
    const nextPageButton = navButtons.at(navButtons.length - 2)
    const currentPage = document.querySelector('.k-link.k-state-selected').textContent
    nextPageButton.click()

    const checkInterval = setInterval(() => {
        const newPage = document.querySelector('.k-link.k-state-selected').textContent

        if(currentPage != newPage) {
            const pageNumberSection = Array.from(document.querySelectorAll('.k-pager-numbers'))[0]
            const activePageNumber =  pageNumberSection.querySelector('.k-link.k-state-selected').textContent
            const lastVisiblePage = Array.from(pageNumberSection.querySelectorAll('.k-link')).at(-1).textContent
            if(activePageNumber === lastVisiblePage) {
                sendResponse({status: "success", message: "We have reached the max page"})
            } else {
                sendResponse({status: "success", message: "We have not reached the max page"})
            }
        }
    }, 100)

    setTimeout(() => {
        clearInterval(checkInterval);
        sendResponse({status: "error", message: "Navigation timeout"});
    }, 5000);
}

const prev = sendResponse => {
    const navButtons = Array.from(document.querySelectorAll('.k-link.k-pager-nav'))
    const prevPageButton = navButtons[1]
    const currentPage = document.querySelector('.k-link.k-state-selected').textContent
    prevPageButton.click()
    
    const checkInterval = setInterval(() => {
        const newPage = document.querySelector('.k-link.k-state-selected').textContent

        if(currentPage != newPage) {
            const pageNumberSection = Array.from(document.querySelectorAll('.k-pager-numbers'))[0]
            const activePageNumber =  pageNumberSection.querySelector('.k-link.k-state-selected').textContent
            if(activePageNumber == "1") {
                sendResponse({status: "success", message: "We have reached the first page"})
            } else {
                sendResponse({status: "success", message: "We have not reached the first page"})
            }
        }
    }, 100)

    setTimeout(() => {
        clearInterval(checkInterval);
        sendResponse({status: "error", message: "Navigation timeout"});
    }, 5000);
}

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
