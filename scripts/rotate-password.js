import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

// Load env vars
dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS
const ADMIN_EMAIL = 'sergioamoraga31@gmail.com'

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !EMAIL_USER || !EMAIL_PASS) {
    console.error('Missing required environment variables.')
    process.exit(1)
}

// 1. Initialize Supabase (Service Role is critical to bypass RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// 2. Generate Random Password
function generatePassword(length = 12) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let retVal = ""
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n))
    }
    return retVal
}

async function rotatePassword() {
    try {
        console.log('Starting password rotation...')

        const newManagerPass = generatePassword(10)
        const newCommercialPass = generatePassword(8) // Slightly shorter/simpler for commercials?

        // 3. Update Database (Parallel updates)
        const [{ error: managerError }, { error: commercialError }] = await Promise.all([
            supabase.from('app_config').upsert({ key: 'manager_password', value: newManagerPass }),
            supabase.from('app_config').upsert({ key: 'commercial_password', value: newCommercialPass })
        ])

        if (managerError) throw managerError
        if (commercialError) throw commercialError
        console.log('Database updated successfully.')

        // 4. Send Email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            }
        })

        const mailOptions = {
            from: `"Link Energy Bot" <${EMAIL_USER}>`,
            to: ADMIN_EMAIL,
            subject: '🔐 Nuevas Contraseñas Semanales - Link Energy',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #4f46e5;">Rotación Semanal de Contraseñas</h2>
                    <p>Hola,</p>
                    <p>Las contraseñas de acceso han sido actualizadas:</p>
                    
                    <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; margin: 30px 0;">
                        <!-- Manager Card -->
                        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #e5e7eb; min-width: 200px;">
                            <span style="font-size: 14px; color: #6b7280; text-transform: uppercase; font-weight: bold;">Gerente</span><br/>
                            <div style="margin-top: 10px;">
                                <strong style="font-size: 24px; color: #4f46e5; letter-spacing: 1px;">${newManagerPass}</strong>
                            </div>
                        </div>

                        <!-- Commercial Card -->
                        <div style="background: #ecfeff; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #cffafe; min-width: 200px;">
                            <span style="font-size: 14px; color: #0891b2; text-transform: uppercase; font-weight: bold;">Comerciales</span><br/>
                            <div style="margin-top: 10px;">
                                <strong style="font-size: 24px; color: #0e7490; letter-spacing: 1px;">${newCommercialPass}</strong>
                            </div>
                        </div>
                    </div>

                    <p style="font-size: 12px; color: #6b7280; text-align: center;">
                        Válidas hasta el próximo lunes a las 9:00 AM.
                    </p>
                </div>
            `
        }

        await transporter.sendMail(mailOptions)
        console.log(`Email sent to ${ADMIN_EMAIL}`)

    } catch (err) {
        console.error('Failed to rotate password:', err)
        process.exit(1)
    }
}

rotatePassword()
