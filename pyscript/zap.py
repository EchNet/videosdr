#!/usr/bin/env python3
import requests, time

zap_url = "https://hooks.zapier.com/hooks/catch/8740939/ogvacqa/";
name = "Q"

print(f"issuing zap request... {time.time()}")
r = requests.post(zap_url,
                  json={
                      "email": "ech@ech.net",
                      "first_name": name,
                      "firstname": name,
                      "name": name,
                      "company": f"{name}Co"
                  })
print(f"received response ... {time.time()}")
print(f"response is {r.status_code} {r.text}")
