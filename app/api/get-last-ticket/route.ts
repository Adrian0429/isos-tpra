import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (
      !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
      !process.env.GOOGLE_PRIVATE_KEY ||
      !process.env.GOOGLE_SHEET_ID
    ) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "tembagapura!A:B",
    });

    const rows = response.data.values || [];

    if (rows.length <= 1) {
      return NextResponse.json({
        success: true,
        data: { ticketNumber: 0 },
      });
    }

    // Today's date (local)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter rows that are from today
    const todayRows = rows.filter(row => {
      if (!row[0] || !row[1]) return false;

      const rowDate = new Date(row[1]);
      if (isNaN(rowDate.getTime())) return false;

      rowDate.setHours(0, 0, 0, 0);
      return rowDate.getTime() === today.getTime();
    });

    if (todayRows.length === 0) {
      return NextResponse.json({
        success: true,
        data: { ticketNumber: 0 },
      });
    }

    // Get last ticket of today
    const lastRow = todayRows.at(-1);
    const [ticketNumber, timestamp] = lastRow!;

    return NextResponse.json({
      success: true,
      data: {
        ticketNumber: parseInt(ticketNumber, 10),
        timestamp,
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch last ticket",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
