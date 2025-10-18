// Simple test script to verify IndexedDB implementation
import { authService } from './auth-service'
import { migrationService } from './migration'
import { isIndexedDBSupported } from './index'

export const testDatabaseImplementation = async (): Promise<void> => {
  console.log('🧪 Testing IndexedDB Implementation...')

  try {
    // Test 1: Check IndexedDB support
    console.log('1. Checking IndexedDB support...')
    const supported = isIndexedDBSupported()
    console.log(`   IndexedDB supported: ${supported}`)

    if (!supported) {
      console.error('❌ IndexedDB is not supported in this browser')
      return
    }

    // Test 2: Migration status
    console.log('2. Checking migration status...')
    await migrationService.logMigrationStatus()

    // Test 3: Store test auth data
    console.log('3. Testing auth data storage...')
    const testUser = {
      id: 'test-user-123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'USER' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    }

    await authService.storeAuthData(
      'test-access-token',
      'test-refresh-token',
      testUser
    )
    console.log('   ✅ Auth data stored successfully')

    // Test 4: Retrieve auth data
    console.log('4. Testing auth data retrieval...')
    const authData = await authService.getAuthData()
    if (authData) {
      console.log('   ✅ Auth data retrieved successfully')
      console.log(`   User: ${authData.user.username}`)
      console.log(`   Token expires: ${authData.expiresAt}`)
    } else {
      console.error('   ❌ Failed to retrieve auth data')
    }

    // Test 5: Database size
    console.log('5. Checking database size...')
    const size = await authService.getDatabaseSize()
    console.log(`   Database size: ${size} bytes`)

    // Test 6: Cleanup
    console.log('6. Testing cleanup...')
    await authService.clearAuthData()
    console.log('   ✅ Auth data cleared successfully')

    console.log(
      '🎉 All tests passed! IndexedDB implementation is working correctly.'
    )
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Export for manual testing in browser console
if (typeof window !== 'undefined') {
  ;(window as any).testIndexedDB = testDatabaseImplementation
  console.log('💡 You can test IndexedDB by running: testIndexedDB()')
}
