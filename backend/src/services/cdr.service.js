const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const CDR = require('../models/cdr.model');

let _cachedRecords = null;

/**
 * Loads CSV records into the database if empty.
 */
async function seedFromCSV() {
  const count = await CDR.countDocuments();
  if (count > 0) return;

  const csvPath = path.join(__dirname, '../../data/mock-cdr.csv');
  if (!fs.existsSync(csvPath)) return;
  
  const raw = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    cast: (value, context) => {
      if (context.column === 'callDirection' || context.column === 'callStatus') {
        return value.toLowerCase() === 'true';
      }
      if (context.column === 'callDuration') {
        return parseInt(value, 10);
      }
      return value;
    },
  });

  await CDR.insertMany(records);
}

/**
 * Returns filtered + paginated CDR records from MongoDB.
 */
async function getCDRRecords(options = {}) {
  const {
    startDate,
    endDate,
    caller,
    receiver,
    city,
    direction,
    status,
    page = 1,
    limit = 20,
  } = options;

  const query = {};

  if (startDate || endDate) {
    query.callStartTime = {};
    if (startDate) query.callStartTime.$gte = startDate;
    if (endDate) query.callStartTime.$lte = endDate;
  }

  if (caller) {
    query.$or = [
      { callerNumber: { $regex: caller, $options: 'i' } },
      { callerName: { $regex: caller, $options: 'i' } },
    ];
  }

  if (receiver) query.receiverNumber = { $regex: receiver, $options: 'i' };
  if (city) query.city = { $regex: city, $options: 'i' };
  
  if (direction === 'inbound') query.callDirection = true;
  else if (direction === 'outbound') query.callDirection = false;

  if (status === 'success') query.callStatus = true;
  else if (status === 'failed') query.callStatus = false;

  const total = await CDR.countDocuments(query);
  const totalPages = Math.ceil(total / limit);
  const data = await CDR.find(query)
    .sort({ callStartTime: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

/**
 * Compute CDR analytics.
 */
async function getCDRAnalytics(filters = {}) {
  const { data: records } = await getCDRRecords({ ...filters, page: 1, limit: 100000 });

  if (records.length === 0) {
    return {
      totalCalls: 0,
      totalDuration: 0,
      avgDuration: 0,
      totalCost: 0,
      successfulCalls: 0,
      failedCalls: 0,
      inboundCalls: 0,
      outboundCalls: 0,
      topCallers: [],
      callsByCity: {},
      callsByHour: {},
      callsByDay: {},
      costsByCity: {},
    };
  }

  let totalDuration = 0;
  let totalCost = 0;
  let successfulCalls = 0;
  let failedCalls = 0;
  let inboundCalls = 0;
  let outboundCalls = 0;

  const callsByCity = {};
  const callsByHour = {};
  const callsByDay = {};
  const costsByCity = {};
  const callerCount = {};

  records.forEach((r) => {
    const cost = parseFloat(r.callCost) || 0;
    totalDuration += r.callDuration;
    totalCost += cost;

    if (r.callStatus) successfulCalls++;
    else failedCalls++;

    if (r.callDirection) inboundCalls++;
    else outboundCalls++;

    callsByCity[r.city] = (callsByCity[r.city] || 0) + 1;
    costsByCity[r.city] = (costsByCity[r.city] || 0) + cost;

    const dateStr = r.callStartTime.includes('T') ? r.callStartTime : r.callStartTime.replace(' ', 'T');
    const hour = new Date(dateStr).getUTCHours();
    callsByHour[hour] = (callsByHour[hour] || 0) + 1;

    const day = r.callStartTime.slice(0, 10);
    callsByDay[day] = (callsByDay[day] || 0) + 1;

    callerCount[r.callerNumber] = callerCount[r.callerNumber] || {
      callerName: r.callerName,
      callerNumber: r.callerNumber,
      count: 0,
    };
    callerCount[r.callerNumber].count++;
  });

  const topCallers = Object.values(callerCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalCalls: records.length,
    totalDuration,
    avgDuration: Math.round(totalDuration / records.length),
    totalCost: parseFloat(totalCost.toFixed(2)),
    successfulCalls,
    failedCalls,
    inboundCalls,
    outboundCalls,
    topCallers,
    callsByCity,
    callsByHour,
    callsByDay,
    costsByCity,
  };
}

async function getAvailableCities() {
  return await CDR.distinct('city');
}

// ─── Admin CRUD ─────────────────────────────────────────────────────────────

async function createCDR(data) {
  return await CDR.create(data);
}

async function updateCDR(id, data) {
  return await CDR.findByIdAndUpdate(id, data, { new: true });
}

async function deleteCDR(id) {
  return await CDR.findByIdAndDelete(id);
}

module.exports = { 
  getCDRRecords, 
  getCDRAnalytics, 
  getAvailableCities, 
  seedFromCSV,
  createCDR,
  updateCDR,
  deleteCDR
};
