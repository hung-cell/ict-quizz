# PowerShell script to start Vercel dev with environment variables from .env.local

# Read .env.local file and set environment variables
Get-Content .env.local | ForEach-Object {
    if ($_ -match '^(.*?)=(.*)$') {
        $name = $matches[1]
        $value = $matches[2]
        [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

# Run Vercel dev with token from environment
npx vercel dev --token $env:VERCEL_TOKEN --yes
