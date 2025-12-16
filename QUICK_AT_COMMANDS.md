# Quick AT Commands Reference for SIMCOM A7672S

## Quick Fix for 715 Handshake Failed Error

Run these commands in Docklight **in order**:

```
AT
AT+CREG?
AT+CGREG?
AT+CGACT=1,1
AT+SSLENABLE=1
AT+SSLVERSION=4`
AT+SSLVERIFY=0
AT+HTTPINIT
AT+HTTPPARA="URL","https://YOUR-RENDER-URL.onrender.com/api/WebDataStrings?id=123&Data=s1_18/06/2025,s2_13:58:22,s16_2.8,s25_12.97"
AT+HTTPACTION=0
```

**Wait 5-10 seconds, then:**
```
AT+HTTPREAD
AT+HTTPTERM
```

## Replace YOUR-RENDER-URL with your actual Render URL!

## Step-by-Step Explanation

1. `AT` - Check if module responds
2. `AT+CREG?` - Check network registration (should show +CREG: 0,1 or 0,5)
3. `AT+CGREG?` - Check GPRS registration (should show +CGREG: 0,1 or 0,5)
4. `AT+CGACT=1,1` - Activate internet connection
5. `AT+SSLENABLE=1` - Enable SSL support
6. `AT+SSLVERSION=4` - Use TLS 1.2 (most compatible)
7. `AT+SSLVERIFY=0` - **Skip certificate verification** (fixes 715 error)
8. `AT+HTTPINIT` - Start HTTP service
9. `AT+HTTPPARA="URL","..."` - Set your API URL
10. `AT+HTTPACTION=0` - Send GET request (0 = GET, 1 = POST)
11. `AT+HTTPREAD` - Read the response
12. `AT+HTTPTERM` - Close HTTP service

## Important Notes

- **Replace the URL** with your actual Render deployment URL
- Add **2-3 second delays** between commands in Docklight
- The `AT+SSLVERIFY=0` command is key to fixing the 715 error
- Make sure your SIM card has data plan activated
- Check APN settings if network registration fails

## Testing

First test with a simple endpoint:
```
AT+HTTPINIT
AT+HTTPPARA="URL","https://YOUR-RENDER-URL.onrender.com/api/health"
AT+HTTPACTION=0
```

This should return: `{"status":"OK","message":"Server is running",...}`

