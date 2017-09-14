curl http://sansara.health-samurai.io/MedicationStatement/a9ba44f1-ed77-4626-9941-0734e5247318 > med.json
curl -H "Content-Type: application/json" -X PUT -d @med3.json http://sansara.health-samurai.io/MedicationStatement/172c49d9-930a-489d-91b3-0c308540e684
