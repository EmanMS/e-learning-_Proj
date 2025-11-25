import requests
try:
    resp = requests.post('http://127.0.0.1:8000/api/token/', json={'username': 'instructor_demo', 'password': 'pass1234'})
    print(f"Token Status: {resp.status_code}")
    if resp.status_code == 200:
        token = resp.json()['access']
        
        # Test ?mine=true
        headers = {'Authorization': f'Bearer {token}'}
        resp_mine = requests.get('http://127.0.0.1:8000/api/courses/?mine=true', headers=headers)
        print(f"Mine courses count: {len(resp_mine.json())}")
        
        # Test ?enrolled=true
        resp_enrolled = requests.get('http://127.0.0.1:8000/api/courses/?enrolled=true', headers=headers)
        print(f"Enrolled courses count: {len(resp_enrolled.json())}")
    else:
        print(resp.text)
except Exception as e:
    print(e)
