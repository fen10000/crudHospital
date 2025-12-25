// 初始医院数据
let hospitals = [
    {
        id: 1,
        name: '北京协和医院',
        city: '北京',
        level: '三级甲等',
        address: '北京市东城区王府井帅府园1号',
        phone: '010-69156114',
        doctors: 1500,
        beds: 2200,
        description: '中国医学科学院北京协和医院位于北京市中心，是一所集医疗、教学、科研于一体的现代化综合医院。'
    },
    {
        id: 2,
        name: '上海瑞金医院',
        city: '上海',
        level: '三级甲等',
        address: '上海市黄浦区瑞金二路197号',
        phone: '021-64370045',
        doctors: 1200,
        beds: 1800,
        description: '上海交通大学医学院附属瑞金医院是一所三级甲等医院，具有深厚的文化底蕴和雄厚的医疗实力。'
    },
    {
        id: 3,
        name: '广州中山大学附属第一医院',
        city: '广州',
        level: '三级甲等',
        address: '广州市越秀区中山二路58号',
        phone: '020-28823388',
        doctors: 1300,
        beds: 2000,
        description: '中山大学附属第一医院是国家三级甲等医院，是全国首批现代化教学医院。'
    },
    {
        id: 4,
        name: '深圳市人民医院',
        city: '深圳',
        level: '三级甲等',
        address: '深圳市罗湖区东门北路1017号',
        phone: '0755-25533018',
        doctors: 1100,
        beds: 1600,
        description: '深圳市人民医院是一家集医疗、科研、教学、预防保健于一体的大型综合医院。'
    },
    {
        id: 5,
        name: '杭州浙江医院',
        city: '杭州',
        level: '三级甲等',
        address: '杭州市上城区解放路261号',
        phone: '0571-87236114',
        doctors: 950,
        beds: 1400,
        description: '浙江医院是浙江省卫生厅直属的三级甲等医院，也是浙江大学医学部附属第二医院。'
    }
];

// 当前编辑的医院ID
let editingHospitalId = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    loadHospitals();
    setupEventListeners();
});

// 设置事件监听
function setupEventListeners() {
    document.getElementById('hospitalForm').addEventListener('submit', handleFormSubmit);
}

// 从本地存储加载医院数据
function loadHospitals() {
    const savedData = localStorage.getItem('hospitals');
    if (savedData) {
        hospitals = JSON.parse(savedData);
    } else {
        // 首次使用时保存初始数据
        saveToLocalStorage();
    }
    displayHospitals(hospitals);
}

// 保存到本地存储
function saveToLocalStorage() {
    localStorage.setItem('hospitals', JSON.stringify(hospitals));
}

// 显示医院列表
function displayHospitals(data) {
    const container = document.getElementById('hospitalsContainer');
    const emptyState = document.getElementById('emptyState');
    const totalCount = document.getElementById('totalCount');

    if (data.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        totalCount.textContent = '0';
        return;
    }

    emptyState.style.display = 'none';
    totalCount.textContent = data.length;

    container.innerHTML = data.map(hospital => `
        <div class="hospital-card">
            <div class="hospital-header">
                <div class="hospital-name">${hospital.name}</div>
                <span class="hospital-level">${hospital.level}</span>
            </div>

            <div class="hospital-info">
                <div class="info-item">${hospital.city}</div>
                <div class="info-item phone">${hospital.phone}</div>
                <div class="info-item doctors">医生数：${hospital.doctors || '-'}</div>
                <div class="info-item beds">床位数：${hospital.beds || '-'}</div>
            </div>

            <div class="hospital-description">
                ${hospital.description || '暂无介绍'}
            </div>

            <div class="card-actions">
                <button class="btn-small btn-detail" onclick="showDetail(${hospital.id})">查看详情</button>
                <button class="btn-small btn-edit" onclick="editHospital(${hospital.id})">编辑</button>
                <button class="btn-small btn-delete" onclick="deleteHospital(${hospital.id})">删除</button>
            </div>
        </div>
    `).join('');
}

// 搜索医院
function searchHospitals() {
    const searchText = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!searchText) {
        displayHospitals(hospitals);
        return;
    }

    const filtered = hospitals.filter(hospital =>
        hospital.name.toLowerCase().includes(searchText) ||
        hospital.city.toLowerCase().includes(searchText) ||
        hospital.address.toLowerCase().includes(searchText)
    );

    displayHospitals(filtered);
}

// 按城市过滤
function filterByCity() {
    const city = document.getElementById('cityFilter').value;
    const level = document.getElementById('levelFilter').value;

    let filtered = hospitals;

    if (city) {
        filtered = filtered.filter(h => h.city === city);
    }

    if (level) {
        filtered = filtered.filter(h => h.level === level);
    }

    displayHospitals(filtered);
}

// 按等级过滤
function filterByLevel() {
    filterByCity(); // 调用城市过滤以应用所有过滤条件
}

// 打开添加医院模态框
function openAddModal() {
    editingHospitalId = null;
    document.getElementById('modalTitle').textContent = '添加医院';
    document.getElementById('hospitalForm').reset();
    document.getElementById('hospitalModal').style.display = 'block';
}

// 关闭模态框
function closeModal() {
    document.getElementById('hospitalModal').style.display = 'none';
    editingHospitalId = null;
}

// 关闭详情模态框
function closeDetailModal() {
    document.getElementById('detailModal').style.display = 'none';
}

// 编辑医院
function editHospital(id) {
    const hospital = hospitals.find(h => h.id === id);
    if (!hospital) return;

    editingHospitalId = id;
    document.getElementById('modalTitle').textContent = '编辑医院';

    document.getElementById('hospitalName').value = hospital.name;
    document.getElementById('city').value = hospital.city;
    document.getElementById('level').value = hospital.level;
    document.getElementById('address').value = hospital.address;
    document.getElementById('phone').value = hospital.phone;
    document.getElementById('doctors').value = hospital.doctors;
    document.getElementById('beds').value = hospital.beds;
    document.getElementById('description').value = hospital.description;

    document.getElementById('hospitalModal').style.display = 'block';
}

// 处理表单提交
function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('hospitalName').value.trim(),
        city: document.getElementById('city').value,
        level: document.getElementById('level').value,
        address: document.getElementById('address').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        doctors: parseInt(document.getElementById('doctors').value) || 0,
        beds: parseInt(document.getElementById('beds').value) || 0,
        description: document.getElementById('description').value.trim()
    };

    // 验证必填字段
    if (!formData.name || !formData.city || !formData.level) {
        showNotification('请填写所有必填字段', 'error');
        return;
    }

    if (editingHospitalId) {
        // 编辑现有医院
        const hospital = hospitals.find(h => h.id === editingHospitalId);
        if (hospital) {
            Object.assign(hospital, formData);
            showNotification('医院信息已更新', 'success');
        }
    } else {
        // 添加新医院
        const newHospital = {
            id: Math.max(...hospitals.map(h => h.id), 0) + 1,
            ...formData
        };
        hospitals.push(newHospital);
        showNotification('医院添加成功', 'success');
    }

    saveToLocalStorage();
    displayHospitals(hospitals);
    closeModal();
    clearFilters();
}

// 删除医院
function deleteHospital(id) {
    if (confirm('确定要删除这家医院吗？此操作无法撤销。')) {
        hospitals = hospitals.filter(h => h.id !== id);
        saveToLocalStorage();
        displayHospitals(hospitals);
        showNotification('医院已删除', 'success');
        clearFilters();
    }
}

// 显示医院详情
function showDetail(id) {
    const hospital = hospitals.find(h => h.id === id);
    if (!hospital) return;

    const detailContent = document.getElementById('detailContent');
    detailContent.innerHTML = `
        <div class="detail-content">
            <h2 class="detail-title">${hospital.name}</h2>

            <div class="detail-meta">
                <div class="detail-item">
                    <div class="detail-item-label">医院等级</div>
                    <div class="detail-item-value">${hospital.level}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-item-label">城市</div>
                    <div class="detail-item-value">${hospital.city}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-item-label">医生数量</div>
                    <div class="detail-item-value">${hospital.doctors} 人</div>
                </div>
                <div class="detail-item">
                    <div class="detail-item-label">床位数</div>
                    <div class="detail-item-value">${hospital.beds} 张</div>
                </div>
            </div>

            <div class="detail-item">
                <div class="detail-item-label">详细地址</div>
                <div class="detail-item-value">${hospital.address}</div>
            </div>

            <div class="detail-item" style="margin-top: 15px;">
                <div class="detail-item-label">联系电话</div>
                <div class="detail-item-value">${hospital.phone}</div>
            </div>

            <div style="margin-top: 20px;">
                <div class="detail-item-label">医院简介</div>
                <div class="detail-description">${hospital.description || '暂无介绍'}</div>
            </div>

            <div class="detail-actions">
                <button class="detail-edit" onclick="editHospitalFromDetail(${hospital.id})">编辑</button>
                <button class="detail-delete" onclick="deleteHospitalFromDetail(${hospital.id})">删除</button>
            </div>
        </div>
    `;

    document.getElementById('detailModal').style.display = 'block';
}

// 从详情页编辑医院
function editHospitalFromDetail(id) {
    closeDetailModal();
    editHospital(id);
}

// 从详情页删除医院
function deleteHospitalFromDetail(id) {
    closeDetailModal();
    deleteHospital(id);
}

// 清除过滤条件
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('cityFilter').value = '';
    document.getElementById('levelFilter').value = '';
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 关闭模态框 - 点击外部区域
window.onclick = function(event) {
    const hospitalModal = document.getElementById('hospitalModal');
    const detailModal = document.getElementById('detailModal');

    if (event.target === hospitalModal) {
        hospitalModal.style.display = 'none';
    }

    if (event.target === detailModal) {
        detailModal.style.display = 'none';
    }
};

// 支持回车搜索
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchHospitals();
            }
        });
    }
});
