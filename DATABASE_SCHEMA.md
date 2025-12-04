# Mobile Lifestyle - Database Schema

## Appwrite Collections

Appwrite Account service tự động quản lý xác thực và thông tin user (email, password, name, session). App chỉ cần tạo các collections sau:

### 1. **health_records**
Lưu bản ghi sức khỏe của người dùng

| Field | Type | Description |
|-------|------|-------------|
| $id | String | Record ID |
| userId | String | User ID (Reference) |
| diseaseId | String | Loại bệnh (blood-pressure, diabetes, etc.) |
| diseaseName | String | Tên bệnh tiếng Việt |
| value1 | Float | Giá trị chỉ số thứ nhất (tùy loại bệnh) |
| value2 | Float | Giá trị chỉ số thứ hai (optional) |
| value3 | Float | Giá trị chỉ số thứ ba (optional) |
| value4 | Float | Giá trị chỉ số thứ tư (optional) |
| unit1 | String | Đơn vị của value1 |
| unit2 | String | Đơn vị của value2 |
| unit3 | String | Đơn vị của value3 |
| unit4 | String | Đơn vị của value4 |
| notes | String | Ghi chú bổ sung (text) |
| recordDate | DateTime | Ngày/giờ ghi nhận |
| createdAt | DateTime | Ngày tạo record |
| updatedAt | DateTime | Lần cập nhật cuối |

**Example mapping cho các bệnh:**
```
Huyết áp (blood-pressure):
  value1 = Tâm thu (systolic) → unit1 = "mmHg"
  value2 = Tâm trương (diastolic) → unit2 = "mmHg"

Tiểu đường (diabetes):
  value1 = Đường huyết → unit1 = "mg/dL"
  value2 = HbA1c → unit2 = "%"

Mỡ máu (cholesterol):
  value1 = Cholesterol tổng → unit1 = "mg/dL"
  value2 = Triglycerides → unit2 = "mg/dL"
  value3 = LDL → unit3 = "mg/dL"
  value4 = HDL → unit4 = "mg/dL"

Cân nặng (weight):
  value1 = Cân nặng → unit1 = "kg"
  value2 = Chiều cao → unit2 = "cm"
```

---

### 2. **user_profiles**
Lưu thông tin cơ bản về sức khỏe người dùng

| Field | Type | Description |
|-------|------|-------------|
| $id | String | Profile ID |
| userId | String | User ID (Reference) |
| dateOfBirth | Date | Ngày sinh |
| gender | String | Giới tính (male, female, other) |
| height | Float | Chiều cao (cm) |
| weight | Float | Cân nặng (kg) |
| bloodType | String | Nhóm máu (A, B, AB, O) |
| createdAt | DateTime | Ngày tạo profile |
| updatedAt | DateTime | Lần cập nhật cuối |

---

### 3. **health_alerts**
Lưu cảnh báo sức khỏe tự động

| Field | Type | Description |
|-------|------|-------------|
| $id | String | Alert ID |
| userId | String | User ID (Reference) |
| alertType | String | Loại cảnh báo (warning, info, success) |
| title | String | Tiêu đề cảnh báo |
| description | String | Mô tả chi tiết |
| severity | String | Mức độ (critical, high, medium, low) |
| isRead | Boolean | Đã đọc? |
| createdAt | DateTime | Thời gian tạo |
| readAt | DateTime | Thời gian đọc (null nếu chưa) |

---

## Appwrite Setup Commands

### 1. Tạo Database
```bash
# Appwrite Console hoặc API
Database ID: health_db
```

### 2. Tạo Collections
```javascript
// Ví dụ tạo collection health_records
const response = await databases.createCollection(
  'health_db',
  'health_records',
  'health_records'
);
```

### 3. Tạo Attributes (Fields)
```javascript
// Ví dụ cho health_records
await databases.createStringAttribute(
  'health_db',
  'health_records',
  'userId',
  255,
  true  // required
);

await databases.createStringAttribute(
  'health_db',
  'health_records',
  'diseaseId',
  50,
  true
);

await databases.createDatetimeAttribute(
  'health_db',
  'health_records',
  'recordDate',
  true
);

// ... tiếp tục cho các field khác
```

### 4. Tạo Indexes
```javascript
// Index trên userId để tìm kiếm nhanh
await databases.createIndex(
  'health_db',
  'health_records',
  'idx_userId',
  'key',
  ['userId']
);

// Index trên (userId, recordDate) để sort
await databases.createIndex(
  'health_db',
  'health_records',
  'idx_userId_recordDate',
  'key',
  ['userId', 'recordDate']
);
```

---

## Relationships & Security

### Collection Permissions
```
health_records:
- User chỉ có thể đọc/viết record của chính mình
- Rule: documents.userId == $user.id

health_targets:
- Tương tự health_records

chat_sessions:
- User chỉ có thể truy cập session của mình

user_profiles:
- User chỉ có thể sửa profile của chính mình
```

### Indexes Priority
1. **High Priority**: userId (tất cả collections)
2. **Medium Priority**: diseaseId, createdAt, recordDate
3. **Low Priority**: title, status

---

## Data Validation Rules

### health_records
- `diseaseId` phải match với DISEASE_LIST
- `data` structure phải match fields definition
- `recordDate` không được > hôm nay

### health_targets
- `minValue` < `maxValue` (nếu cả 2 có)
- `unit` phải hợp lệ

---

## Migration Plan

### Phase 1: Core Collections
- [ ] health_records
- [ ] user_profiles
- [ ] health_alerts

---

## Notes
- Tất cả collections sử dụng UTC timezone
- Soft delete: thêm `deletedAt` field thay vì xóa
- Audit log: track changes cho sensitive data
- Backup strategy: daily backup tất cả collections
- **Authentication**: Appwrite Account tự động quản lý xác thực (email, password, session). Lấy user info từ `account.get()`
- **User Profile**: Thông tin cơ bản (dateOfBirth, gender, height, weight, bloodType) lưu riêng trong user_profiles collection
- **Chat Management**: Quản lý trò chuyện được xử lý bên AI service (Groq, OpenAI, etc.), không lưu vào Appwrite database
- **Statistics Calculation**: Thống kê hàng ngày được tính từ `health_records` collection
