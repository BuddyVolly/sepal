const fs = require('fs')
const {of} = require('rxjs')
const {mergeMap, scan, switchMap, tap} = require('rxjs/operators')
const format = require('./format')
const drive = require('./drive')
const log = require('sepal/log').getLogger('task')
const {lastInWindow} = require('sepal/operators')

const CONCURRENT_FILE_DOWNLOAD = 3

const download$ = ({path, downloadDir, deleteAfterDownload}) =>
    drive.downloadDir$(path, downloadDir, {
        concurrency: CONCURRENT_FILE_DOWNLOAD,
        deleteAfterDownload,
        throttleUpdates: 1000
    }).pipe(
        // tap(log.warn)
        lastInWindow(1000)
    )

// const getProgress = ({
//     files,
//     currentProgress = {downloadedFiles: 0, downloadedBytes: 0},
//     fileProgress = {start: 0, end: -1}
// }) => {
//     const downloadedFiles = currentProgress.downloadedFiles + (isDownloaded(fileProgress) ? 1 : 0)
//     const downloadedBytes = currentProgress.downloadedBytes + fileProgress.end - fileProgress.start + 1
//     const downloaded = formatFileSize(downloadedBytes)
//     const totalFiles = files.length
//     const totalBytes = files
//         .map(file => Number(file.size)) // different from cloudstorage
//         .reduce((total, bytes) => total + bytes, 0)
//     const total = formatFileSize(totalBytes)
//     return {
//         defaultMessage: `Downloaded ${downloadedFiles} of ${totalFiles} files (${downloaded} of ${total})`,
//         messageKey: 'tasks.drive.download_folder',
//         downloadedFiles,
//         downloadedBytes,
//         downloaded,
//         totalFiles,
//         totalBytes,
//         total
//     }
// }

// const initialState = files => getProgress({files})

// const downloadFiles$ = ({files, prefix, downloadDir, deleteAfterDownload}) => {
//     return of(files).pipe(
//         switchMap(files => of(...files)),
//         mergeMap(file => downloadFile$({file, prefix, downloadDir, deleteAfterDownload}), CONCURRENT_FILE_DOWNLOAD),
//         scan((currentProgress, fileProgress) => getProgress({
//             files,
//             currentProgress,
//             fileProgress
//         }), initialState(files))
//     )
// }

// const isDownloaded = fileProgress => fileProgress.end >= fileProgress.length - 1

// const formatFileSize = bytes =>
//     format.fileSize(bytes)

module.exports = {download$}
