# v0.1 Sample Cases

## 100GB Fortigate 원문+파싱

- Input: 100GB/day, `fortigate-raw-parsed-recommended`, Hot 14d, Replica 1, Margin 30%, 1024GB/node
- dailyPrimaryGb: 46.2
- primaryGb: 646.8
- withReplicaGb: 1293.6
- withSafetyMarginGb: 1681.68
- requiredNodes: 2

## 300GB Hot/Warm SIEM

- Input: 300GB/day, `fortigate-raw-parsed-recommended`, Hot 14d at 5120GB/node, Warm 90d at 10240GB/node, Replica 1, Margin 30%
- Hot withSafetyMarginGb: 5045.04, requiredNodes: 1
- Warm withSafetyMarginGb: 32432.4, requiredNodes: 4
- totalWithSafetyMarginGb: 37477.44
- totalRequiredNodes: 5

## Web Parsed-only

- Profile: `web-parsed-only`
- Lab case: `ldb.syn.zstd.p3`
- storageRatio: 0.254
- Warning: 원문 미보관으로 인해 감사/장애 분석 요구사항을 재검토해야 합니다.

## SNMP TSDS Parsed-only

- Profile: `snmp-tsds-parsed-only`
- Lab case: `tsds.syn.zstd.p3`
- storageRatio: 0.335
- Warning: TSDS는 메트릭/시계열 데이터에 적합하며 일반 이벤트 로그 적용 전 별도 검증이 필요합니다.
