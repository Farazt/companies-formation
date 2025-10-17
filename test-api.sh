#!/bin/bash

# API Testing Script for Company Management System

BASE_URL="http://localhost:3000/api"

echo "=== Company Management System API Tests ==="
echo ""

# Test 1: Create a UK company with all fields
echo "Test 1: Creating UK company with all fields..."
curl -X POST $BASE_URL/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Memecoin Limited",
    "jurisdiction": "UK",
    "address": "10 Downing Street",
    "postCode": "SW1A 2AA",
    "country": "United Kingdom",
    "numberOfDirectors": 3,
    "numberOfShareholders": 5,
    "activities": "Cryptocurrency Trading",
    "secCode": "MEM001"
  }' | python3 -m json.tool
echo -e "\n"

# Test 2: Create a Singapore company with only required fields
echo "Test 2: Creating Singapore company with required fields only..."
curl -X POST $BASE_URL/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Innovations Pte Ltd",
    "jurisdiction": "Singapore",
    "address": "1 Marina Boulevard",
    "postCode": "018989",
    "country": "Singapore"
  }' | python3 -m json.tool
echo -e "\n"

# Test 3: Create a Caymans company
echo "Test 3: Creating Caymans company..."
curl -X POST $BASE_URL/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Offshore Holdings Ltd",
    "jurisdiction": "Caymans",
    "address": "PO Box 123",
    "postCode": "KY1-1111",
    "country": "Cayman Islands",
    "numberOfDirectors": 1,
    "activities": "Investment Management"
  }' | python3 -m json.tool
echo -e "\n"

# Test 4: Test validation - missing required field
echo "Test 4: Testing validation (missing required field)..."
curl -X POST $BASE_URL/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Incomplete Company"
  }' | python3 -m json.tool
echo -e "\n"

# Test 5: Get all companies
echo "Test 5: Retrieving all companies..."
curl -X GET $BASE_URL/companies | python3 -m json.tool
echo -e "\n"

echo "=== API Tests Complete ==="

