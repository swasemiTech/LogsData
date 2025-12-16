# SIMCOM A7672S Module Configuration Guide

## Problem: 715 Handshake Failed Error

The "715 handshake failed" error occurs when the SIMCOM module cannot complete an SSL/TLS handshake with the server. This is common with embedded modules that have limited SSL/TLS support.

## Solutions

### Solution 1: Configure SIMCOM Module for HTTPS (Recommended)

Since your server is deployed on Render (which uses HTTPS), you need to configure the SIMCOM A7672S module properly.

#### Step 1: Enable SSL/TLS Support
```
AT+SSLENABLE=1
```

#### Step 2: Set SSL Version (Use TLS 1.2)
```
AT+SSLVERSION=4
```
Note: Version 4 = TLS 1.2 (most compatible with modern servers)

#### Step 3: Skip Certificate Verification (If needed)
If certificate verification is causing issues, you can skip it:
```
AT+SSLVERIFY=0
```
⚠️ **Warning**: This makes the connection less secure but may be necessary for embedded devices.

#### Step 4: Configure HTTP Context
```
AT+HTTPINIT
AT+HTTPPARA="URL","https://your-render-url.onrender.com/api/WebDataStrings?id=123&Data=s1_18/06/2025,s2_13:58:22,s16_2.8,s25_12.97"
AT+HTTPPARA="CONTENT","application/json"
```

#### Step 5: Send GET Request
```
AT+HTTPACTION=0
```

### Solution 2: Use HTTP Instead of HTTPS (If Available)

If your Render deployment supports HTTP (unlikely on free tier), use HTTP instead:

**Change the URL from:**
```
https://your-render-url.onrender.com/api/WebDataStrings
```

**To:**
```
http://your-render-url.onrender.com/api/WebDataStrings
```

**Note**: Render's free tier typically only supports HTTPS. You may need to:
- Use a different hosting service that supports HTTP (like Railway, Fly.io, or a VPS)
- Or configure the module for HTTPS as shown in Solution 1

### Solution 3: Use a Reverse Proxy with HTTP Support

If you need HTTP support, consider:
1. Using **ngrok** to create an HTTP tunnel
2. Using **Cloudflare Tunnel** (free)
3. Deploying to a service that supports HTTP (Railway, Fly.io)

### Solution 4: Complete AT Command Sequence for SIMCOM A7672S

Here's the complete sequence to send data:

```
// 1. Check if module is ready
AT

// 2. Check network registration
AT+CREG?

// 3. Check GPRS registration
AT+CGREG?

// 4. Activate PDP context
AT+CGACT=1,1

// 5. Enable SSL
AT+SSLENABLE=1

// 6. Set SSL version to TLS 1.2
AT+SSLVERSION=4

// 7. Skip certificate verification (if needed)
AT+SSLVERIFY=0

// 8. Initialize HTTP service
AT+HTTPINIT

// 9. Set URL (replace with your actual Render URL)
AT+HTTPPARA="URL","https://your-app.onrender.com/api/WebDataStrings?id=DEVICE001&Data=s1_18/06/2025,s2_13:58:22,s16_2.8,s25_12.97"

// 10. Set content type
AT+HTTPPARA="CONTENT","application/json"

// 11. Send GET request
AT+HTTPACTION=0

// 12. Read response (wait a few seconds after HTTPACTION)
AT+HTTPREAD

// 13. Terminate HTTP service
AT+HTTPTERM
```

## Testing Your Setup

### Test 1: Basic Connectivity
First, test if the module can reach the internet:
```
AT+HTTPINIT
AT+HTTPPARA="URL","http://httpbin.org/get"
AT+HTTPACTION=0
```

### Test 2: Your API Endpoint
Once basic connectivity works, test your API:
```
AT+HTTPINIT
AT+HTTPPARA="URL","https://your-app.onrender.com/api/WebDataStrings?id=TEST&Data=s1_01/01/2025,s2_12:00:00,s16_0.0,s25_12.0"
AT+HTTPACTION=0
```

## Common Issues and Fixes

### Issue 1: Still Getting 715 Error
- Try `AT+SSLVERIFY=0` to skip certificate verification
- Check if your Render URL is correct
- Verify the module has internet connectivity (`AT+CREG?`, `AT+CGREG?`)

### Issue 2: Module Not Responding
- Check baud rate settings in Docklight
- Verify module power and antenna connection
- Try `AT` command to check if module is alive

### Issue 3: Network Registration Failed
- Check SIM card is inserted and active
- Verify APN settings: `AT+CGDCONT=1,"IP","your-apn"`
- Check signal strength: `AT+CSQ`

### Issue 4: Data Not Saving to MongoDB
- Check Render logs to see if requests are arriving
- Verify MongoDB connection string in environment variables
- Check if the data format matches expected format

## Alternative: Use HTTP Endpoint (If You Switch Hosting)

If you deploy to a service that supports HTTP, the commands are simpler:

```
AT+HTTPINIT
AT+HTTPPARA="URL","http://your-server.com/api/WebDataStrings?id=123&Data=s1_18/06/2025,s2_13:58:22,s16_2.8,s25_12.97"
AT+HTTPACTION=0
```

## Monitoring and Debugging

1. **Check Render Logs**: Go to your Render dashboard → Your service → Logs
2. **Check MongoDB Atlas**: Verify data is being saved
3. **Use Docklight Scripts**: Create automated test scripts in Docklight
4. **Add Delays**: Add delays between AT commands (2-3 seconds) for stability

## Recommended Settings for SIMCOM A7672S

```
// Network settings
AT+CGDCONT=1,"IP","your-apn-name"  // Set your APN
AT+CGACT=1,1                        // Activate PDP context

// SSL/TLS settings
AT+SSLENABLE=1                      // Enable SSL
AT+SSLVERSION=4                     // TLS 1.2
AT+SSLVERIFY=0                      // Skip verification (for embedded use)

// HTTP settings
AT+HTTPINIT                          // Initialize HTTP
AT+HTTPPARA="TIMEOUT",30            // Set timeout to 30 seconds
```

## Next Steps

1. Try Solution 1 first (HTTPS with SSL configuration)
2. If that doesn't work, check Render logs to see if requests are arriving
3. Consider switching to a hosting service that supports HTTP if HTTPS continues to fail
4. Monitor your MongoDB Atlas database to confirm data is being saved

## Support

If issues persist:
- Check SIMCOM A7672S AT command manual
- Verify your Render deployment is running
- Test the API endpoint manually using a browser or Postman
- Check MongoDB Atlas connection and permissions

