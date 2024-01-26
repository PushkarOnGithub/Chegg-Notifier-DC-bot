const idd="Utsav"

let response = fetch("https://gateway.chegg.com/nestor-graph/graphql", {
    method: "POST",
    headers: {
        "accept": "*/*",
        "accept-language": "en-GB,en;q=0.9,en-US;q=0.8",
        "apollographql-client-name": "chegg-web-producers",
        "apollographql-client-version": "main-d4e66b59-5966081892",
        "authorization": "Basic alNNNG5iVHNXV0lHR2Y3OU1XVXJlQjA3YmpFeHJrRzM6SmQxbTVmd3o3aHRobnlCWg==",
        "content-type": "application/json",
        "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Microsoft Edge\";v=\"120\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "Cookie":"country_code=IN; CVID=2c78f748-286e-4d47-98c8-6ba6c01f80de; V=9d2a14119e7bc291224cb4d34d21584e655ba1183db22c.37978027; pxcts=1858e21f-87d0-11ee-a1eb-b52517af1422; _pxvid=1858d511-87d0-11ee-a1eb-bca7ded1e353; loupeclientID=c594c99-1faf-4f29-9db5-064ecba0b3ad; _hjSessionUser_2946394=eyJpZCI6ImNiNWM2ZmUzLTI0MjgtNTlkYi05OGQ0LTAyZGVjNjAzNzY2MyIsImNyZWF0ZWQiOjE3MDEwOTQ4NTUwNzAsImV4aXN0aW5nIjp0cnVlfQ==; _ga=GA1.1.359586072.1701094852; _ga_E1732NRZXV=GS1.2.1701094852.1.0.1701094967.60.0.0; _ga_L6CX34MVT2=GS1.1.1701094851.1.1.1701094971.10.0.0; _hjSessionUser_3091164=eyJpZCI6IjYwYzZkMzMyLWE5NmItNTZlMi1hNDBkLTE2MjBlYjY5ZTM2ZiIsImNyZWF0ZWQiOjE3MDEwOTQ5ODU2MjQsImV4aXN0aW5nIjp0cnVlfQ==; PHPSESSID=egmni9g6j97ri00fnovbp1nf85; C=0; O=0; U=0; exp=C026A; __gads=ID=354720a262beee9b:T=1703087036:RT=1703087036:S=ALNI_Ma1a0eLXeXPJA4rF_gjtAdqiuWGbw; __gpi=UID=00000cb870d67c83:T=1703087036:RT=1703087036:S=ALNI_Mbfl1WaGzsO2zB0ZCOcTO4frz3vqA; access_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IllpMk90dXFUUzNjQ0M4azQ5Vk5lWCJ9.eyJodHRwOnJvbGVzIjpbImV4cGVydCJdLCJodHRwOmVtYWlsIjoidXBhZGh5YXl1dHNhdjkwQGdtYWlsLmNvbSIsImh0dHA6c291cmNlX2lkIjoiZXhwZXJ0IiwiaXNzIjoiaHR0cHM6Ly9jaGVnZy1leHBlcnRzLmNoZWdnLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHxkY2I3NjcwOC02OGNlLTRkN2QtOWI2My03YTcyOGE5NjRjMGUiLCJhdWQiOlsiaHR0cHM6Ly9jaGVnZy1leHBlcnRzLmNoZWdnLmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9jaGVnZy1leHBlcnRzLmNoZWdnLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE3MDQyNTc0NTMsImV4cCI6MTcwNjg0OTQ1MywiYXpwIjoiU055Zmh3QlZ2SUdiU1pQSVRleFlObExtODB1cGhubkkiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIHJlYWQ6Y3VycmVudF91c2VyIHVwZGF0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEgZGVsZXRlOmN1cnJlbnRfdXNlcl9tZXRhZGF0YSBjcmVhdGU6Y3VycmVudF91c2VyX21ldGFkYXRhIGNyZWF0ZTpjdXJyZW50X3VzZXJfZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpjdXJyZW50X3VzZXJfZGV2aWNlX2NyZWRlbnRpYWxzIHVwZGF0ZTpjdXJyZW50X3VzZXJfaWRlbnRpdGllcyBvZmZsaW5lX2FjY2VzcyIsImd0eSI6InBhc3N3b3JkIn0.XAfQLAkOhDLMtQSk47XIeP237bEf0QsX1HhfF39jGCWEB0bQTtzT1dLOSs9oj9EPNPoJRX7-MbGv8_Nd3sjpXxqClzUXp0WdfQ_Si0NPPzulpkrzmvUd9zeh-Dbv2fIS_H-661Fo4AH_p_K1RQI9lVu70zeRvs7Pv_4G9M1Sp-_lUl18P4Sn1f_Bv_-DU9rgqCmT6wQtCqnOnLuDS1sHUFLbgYAExT_5Fdc80_MvtzIx9gDcucRevfYVCE330rXxFAQk_LINku5dKfIWOWkxn9-biYGVB_mTec4QHjcnQducx_wb0y6sGeooApsct4qTeP-Q5jLohGqneUi6WcKgnw; refresh_token=eFANMPnQdXdjwJHQJ4bLTNLB7NMEkhpgJ5gplfZLRAB1b; exp_id=dcb76708-68ce-4d7d-9b63-7a728a964c0e; opt-user-profile=2c78f748-286e-4d47-98c8-6ba6c01f80de%2C26662330013%3A26635410147; user_geo_location=%7B%22country_iso_code%22%3A%22IN%22%2C%22country_name%22%3A%22India%22%2C%22region%22%3A%22UP%22%2C%22region_full%22%3A%22Uttar+Pradesh%22%2C%22city_name%22%3A%22Varanasi%22%2C%22postal_code%22%3A%22221001%22%2C%22locale%22%3A%7B%22localeCode%22%3A%5B%22en-IN%22%2C%22hi-IN%22%2C%22gu-IN%22%2C%22kn-IN%22%2C%22kok-IN%22%2C%22mr-IN%22%2C%22sa-IN%22%2C%22ta-IN%22%2C%22te-IN%22%2C%22pa-IN%22%5D%7D%7D; expkey=3D85A3756704AF4E910B5817252C5133; CSessionID=aa1400ee-f183-4582-8377-9b7a6c172704; forterToken=1f24381bb022446fbe133a76ada38060_1705087502282__UDF43_13ck_; langPreference=en-US; hwh_order_ref=/homework-help/questions-and-answers/compute-ad-da-explain-columns-rows-change-multiplied-d-right-left-find-3-x-3-matrix-b-iden-q68450079; OptanonConsent=isGpcEnabled=0&datestamp=Fri+Jan+26+2024+12%3A28%3A07+GMT%2B0530+(India+Standard+Time)&version=202310.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=3099fb6c-e5e8-4144-8ae3-537eb06bc4cf&interactionCount=1&landingPath=NotLandingPage&groups=fnc%3A0%2Csnc%3A1%2Ctrg%3A0%2Cprf%3A0&AwaitingReconsent=false; _hjSession_3091164=eyJpZCI6IjkyNjFmYzE2LWUwM2EtNDgzNS1iMTAwLWI1NjBhMmZhM2Q5NyIsImMiOjE3MDYyNTU3NDc1NjcsInMiOjAsInIiOjAsInNiIjoxLCJzciI6MCwic2UiOjAsImZzIjowfQ==; CSID=1706255747572; ab.storage.deviceId.49cbafe3-96ed-4893-bfd9-34253c05d80e=%7B%22g%22%3A%228396dc74-9e02-f52b-8d19-0721af67d778%22%2C%22c%22%3A1701094988411%2C%22l%22%3A1706255748630%7D; ab.storage.userId.49cbafe3-96ed-4893-bfd9-34253c05d80e=%7B%22g%22%3A%22dcb76708-68ce-4d7d-9b63-7a728a964c0e%22%2C%22c%22%3A1704257455376%2C%22l%22%3A1706255748630%7D; ab.storage.sessionId.49cbafe3-96ed-4893-bfd9-34253c05d80e=%7B%22g%22%3A%2295cd417c-e614-9b0a-4f17-ac7976fb6dbf%22%2C%22e%22%3A1706257839063%2C%22c%22%3A1706255748628%2C%22l%22%3A1706256039063%7D; _ga_HRYBF3GGTD=GS1.1.1706255747.93.1.1706256047.0.0.0; _ga_1Y0W4H48JW=GS1.1.1706255747.93.1.1706256047.0.0.0"
    },
    referrer: "https://expert.chegg.com/",
    body: "{\"operationName\":\"StartQuestionAnswering\",\"variables\":{\"questionId\":132986024},\"query\":\"mutation StartQuestionAnswering($questionId: Long!) {\\n  startQuestionAnswering(questionId: $questionId)\\n}\"}",
    "mode": "cors",
    "credentials": "include"
  }).then((res)=>{
    res.json().then((res2)=>{
        console.log(res2);
    })
  })
