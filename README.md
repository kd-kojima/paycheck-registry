## Overview
This is the Paycheck Registry.
This was made as practice of Single-Page-Application and API.
You can store your paycheck and manage them on web browser.

## How to use
Prerequisite: Python and `http.server` module (pip) are installed.

1. Run `git clone` to copy application files.
2. If you use Mac, application can be started only by running '`sh app.command`'.  
  Or, run '`python ./app.py 127.0.0.1 8000`', and access `http://127.0.0.1:8000` on web browser.

## Function
This application has functions below.

- **create**: register new paycheck from blank template.
- **duplicate**: register new paycheck from existing paycheck.
- **update**: revise existing paycheck.
- **delete**: delete existing paycheck.

## Storage
Your paycheck data is stored on your devise in '`data.json`'.
