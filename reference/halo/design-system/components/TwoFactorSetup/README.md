Turning on two-factor sign-in: scan, confirm with a code, save recovery codes.

Props: `qr` (node: render the otpauth URI with your QR library), `secret`, `onVerify(code)` (return or resolve true/false), `codes` (recovery codes), `onDownload`, `onDone`, `step`, `scanText`, `codesText`.

- The last step stays locked until the person confirms they saved the codes. (In this preview the code 123456 works.)
