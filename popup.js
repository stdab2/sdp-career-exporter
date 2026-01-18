document.getElementById("exportBtn").addEventListener("click", () => {
    const btn = document.getElementById("exportBtn")
    btn.disabled = true
    btn.textContent = "Exporting..."
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "export_job_offers"}, (response) => {
            btn.disabled = false
            btn.textContent = "Export Job Offers"

            const csvData = buildCSV(response.headers, response.jobs)
            const downloadLink = downloadCSV(csvData)

            document.querySelector('.download').appendChild(downloadLink)
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

const downloadCSV = (csvData) => {
    const blob = new Blob([csvData], { type: 'text/csv' })
    
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = 'jobs.csv'
    a.textContent = 'Download CSV'

    return a
}