[CmdletBinding()]
param (
    [Parameter(Mandatory = $false)]
    [int]
    $port = 1515
)

python.exe -m http.server $port

