import { OrgDomain, TechDomain, Requirement, Technology, User } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', username: 'admin', role: 'administrator', displayName: 'Администратор' },
  { id: 'u2', username: 'test', role: 'user', displayName: 'Тестовый пользователь' },
];

export const MOCK_ORG_DOMAINS: OrgDomain[] = [
  {
    id: 'org-dom-1',
    numericId: 1,
    name: 'Корпоративная сеть',
    version: '1.2',
    owner: 'Иванов А.В.',
    status: 'Активен',
    description: 'Домен охватывает все сетевые сегменты корпоративной инфраструктуры, включая ЛВС, ДМЗ и периметр.',
    versionHistory: [
      { version: '1.0', changedAt: '2024-01-10', changedBy: 'admin', comment: 'Создание' },
      { version: '1.1', changedAt: '2024-03-15', changedBy: 'admin', comment: 'Обновление описания' },
      { version: '1.2', changedAt: '2024-06-20', changedBy: 'admin', comment: 'Добавлен сегмент ДМЗ' },
    ],
    createdAt: '2024-01-10',
    updatedAt: '2024-06-20',
  },
  {
    id: 'org-dom-2',
    numericId: 2,
    name: 'Облачная инфраструктура',
    version: '2.0',
    owner: 'Петрова Н.С.',
    status: 'Активен',
    description: 'Организационный домен для управления облачными ресурсами и политиками доступа к публичным облакам.',
    versionHistory: [
      { version: '1.0', changedAt: '2024-02-01', changedBy: 'admin', comment: 'Создание' },
      { version: '2.0', changedAt: '2024-08-01', changedBy: 'admin', comment: 'Мажорное обновление' },
    ],
    createdAt: '2024-02-01',
    updatedAt: '2024-08-01',
  },
  {
    id: 'org-dom-3',
    numericId: 3,
    name: 'АСУ ТП',
    version: '1.0',
    owner: 'Сидоров К.П.',
    status: 'В разработке',
    description: 'Домен автоматизированных систем управления технологическими процессами.',
    versionHistory: [
      { version: '1.0', changedAt: '2024-11-01', changedBy: 'admin', comment: 'Создание' },
    ],
    createdAt: '2024-11-01',
    updatedAt: '2024-11-01',
  },
];

export const MOCK_TECH_DOMAINS: TechDomain[] = [
  {
    id: 'tech-dom-1',
    numericId: 1,
    name: 'Периметровая защита',
    version: '1.3',
    owner: 'Иванов А.В.',
    status: 'Активен',
    description: 'Технический домен средств защиты периметра: межсетевые экраны, IPS/IDS, WAF.',
    orgDomains: ['org-dom-1'],
    versionHistory: [
      { version: '1.0', changedAt: '2024-01-15', changedBy: 'admin', comment: 'Создание' },
      { version: '1.3', changedAt: '2024-09-10', changedBy: 'admin', comment: 'Добавлен WAF' },
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-09-10',
  },
  {
    id: 'tech-dom-2',
    numericId: 2,
    name: 'Управление идентификацией',
    version: '2.1',
    owner: 'Козлова М.И.',
    status: 'Активен',
    description: 'IAM, PAM, SSO, MFA — технический домен управления учётными записями и доступом.',
    orgDomains: ['org-dom-1', 'org-dom-2'],
    versionHistory: [
      { version: '1.0', changedAt: '2024-02-10', changedBy: 'admin', comment: 'Создание' },
      { version: '2.1', changedAt: '2024-10-05', changedBy: 'admin', comment: 'Добавлен PAM' },
    ],
    createdAt: '2024-02-10',
    updatedAt: '2024-10-05',
  },
];

export const MOCK_REQUIREMENTS: Requirement[] = [
  {
    id: 'req-1',
    numericId: 1,
    name: 'Многофакторная аутентификация',
    version: '1.1',
    owner: 'Козлова М.И.',
    status: 'Активен',
    description: `## Требование\nВсе привилегированные учётные записи **обязаны** использовать MFA.\n\n### Область применения\n- Административные панели\n- VPN-доступ\n- Облачные консоли\n\n### Исключения\nТехнические сервисные аккаунты без интерактивного входа.`,
    versionHistory: [
      { version: '1.0', changedAt: '2024-03-01', changedBy: 'admin', comment: 'Создание' },
      { version: '1.1', changedAt: '2024-07-15', changedBy: 'admin', comment: 'Уточнены исключения' },
    ],
    createdAt: '2024-03-01',
    updatedAt: '2024-07-15',
  },
  {
    id: 'req-2',
    numericId: 2,
    name: 'Шифрование данных в покое',
    version: '1.0',
    owner: 'Иванов А.В.',
    status: 'Активен',
    description: `## Требование\nВсе данные классификации **Конфиденциально** и выше должны хранится в зашифрованном виде.\n\n### Алгоритмы\n- AES-256 для симметричного шифрования\n- RSA-4096 для асимметричного`,
    versionHistory: [
      { version: '1.0', changedAt: '2024-04-01', changedBy: 'admin', comment: 'Создание' },
    ],
    createdAt: '2024-04-01',
    updatedAt: '2024-04-01',
  },
  {
    id: 'req-3',
    numericId: 3,
    name: 'Логирование событий безопасности',
    version: '2.0',
    owner: 'Петрова Н.С.',
    status: 'В разработке',
    description: `## Требование\nВсе события ИБ должны логироваться централизованно в SIEM.\n\n### Срок хранения\n- Горячие логи: 90 дней\n- Архив: 3 года`,
    versionHistory: [
      { version: '1.0', changedAt: '2024-05-01', changedBy: 'admin', comment: 'Создание' },
      { version: '2.0', changedAt: '2024-11-10', changedBy: 'admin', comment: 'Пересмотр сроков хранения' },
    ],
    createdAt: '2024-05-01',
    updatedAt: '2024-11-10',
  },
];

export const MOCK_TECHNOLOGIES: Technology[] = [
  {
    id: 'tech-1',
    numericId: 1,
    name: 'Palo Alto NGFW',
    version: '1.0',
    owner: 'Иванов А.В.',
    status: 'Активен',
    description: `## Описание\nМежсетевой экран нового поколения с функциями глубокой инспекции трафика.\n\n### Применение\n- Периметровая защита\n- Сегментация сети`,
    tags: ['NGFW', 'Firewall', 'Периметр'],
    versionHistory: [
      { version: '1.0', changedAt: '2024-01-20', changedBy: 'admin', comment: 'Добавление' },
    ],
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  {
    id: 'tech-2',
    numericId: 2,
    name: 'CyberArk PAM',
    version: '1.2',
    owner: 'Козлова М.И.',
    status: 'Активен',
    description: `## Описание\nПлатформа управления привилегированным доступом.\n\n### Возможности\n- Хранилище паролей\n- Session recording\n- Just-in-time access`,
    tags: ['PAM', 'IAM', 'Привилегированный доступ'],
    versionHistory: [
      { version: '1.0', changedAt: '2024-02-15', changedBy: 'admin', comment: 'Добавление' },
      { version: '1.2', changedAt: '2024-08-20', changedBy: 'admin', comment: 'Обновление описания' },
    ],
    createdAt: '2024-02-15',
    updatedAt: '2024-08-20',
  },
  {
    id: 'tech-3',
    numericId: 3,
    name: 'Splunk SIEM',
    version: '1.1',
    owner: 'Петрова Н.С.',
    status: 'В разработке',
    description: `## Описание\nСистема управления событиями информационной безопасности.`,
    tags: ['SIEM', 'Мониторинг', 'Логи'],
    versionHistory: [
      { version: '1.0', changedAt: '2024-05-10', changedBy: 'admin', comment: 'Добавление' },
      { version: '1.1', changedAt: '2024-10-01', changedBy: 'admin', comment: 'Уточнение' },
    ],
    createdAt: '2024-05-10',
    updatedAt: '2024-10-01',
  },
];
