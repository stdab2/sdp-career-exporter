document.getElementById("exportBtn").addEventListener("click", () => {
    const btn = document.getElementById("exportBtn")
    btn.disabled = true
    btn.textContent = "Exporting..."
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "export_job_offers"}, (response) => {
            btn.disabled = false
            btn.textContent = "Export Job Offers"

            if(response.status === "success") {
                console.log('here')
                const csvData = buildCSV(response.headers, response.jobs)
                const downloadLink = downloadCSV(csvData, response.jobs.length)

                document.querySelector('.download-container').appendChild(downloadLink)
                createConfetti()
            }
        })
    })
})

document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "verify_page"}, (response) => {
            if (response.status === "success" && response.message === "We are at the first page") {
                document.getElementById("prevBtn").disabled = true
            } else if (response.status === "success" && response.message === "We are at the max page") {
                document.getElementById("nextBtn").disabled = true
            }
        })
    })
})

document.getElementById("nextBtn").addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "next"}, (response) => {
            if (response.status === "success" && response.message === "We have reached the max page") {
                document.getElementById("nextBtn").disabled = true
            }
            if(document.getElementById("prevBtn").disabled) {
                document.getElementById("prevBtn").disabled = false
            }
        })
    })
})

document.getElementById("prevBtn").addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "prev"}, (response) => {
            if (response.status === "success" && response.message === "We have reached the first page") {
                document.getElementById("prevBtn").disabled = true
            }
            if(document.getElementById("nextBtn").disabled) {
                document.getElementById("nextBtn").disabled = false
            }
        })
    })
})

const buildCSV = (headers, jobs) => {
    const csvData = []
    csvData.push(headers.join(','))

    for (const row of jobs) {
        const values = headers.map(header => {
            const value = row[header]
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        });
        csvData.push(values.join(','))
    }

    return csvData.join('\n')
}

const downloadCSV = (csvData, numberOfJobs) => {
    const blob = new Blob([csvData], { type: 'text/csv' })
    
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = 'jobs.csv'
    a.textContent = `Download CSV (${numberOfJobs} job offers)`

    return a
}

const createConfetti = () => {
    const colors = ['#ff9244', '#1e5eff', '#10b981', '#f59e0b', '#ec4899']
    const confettiCount = 30
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div')
            confetti.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                opacity: 1;
                pointer-events: none;
                z-index: 9999;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            `
            
            document.body.appendChild(confetti)
            
            const duration = 1000 + Math.random() * 1000
            const rotate = Math.random() * 360
            
            confetti.animate([
                { 
                    transform: `translateY(0) rotate(0deg)`,
                    opacity: 1
                },
                { 
                    transform: `translateY(300px) rotate(${rotate}deg)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            })
            
            setTimeout(() => confetti.remove(), duration);
        }, i * 30)
    }
};