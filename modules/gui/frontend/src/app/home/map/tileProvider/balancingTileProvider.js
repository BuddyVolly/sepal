import {TileProvider} from './tileProvider'
import {debounceTime, mergeMap, retryWhen, switchMap} from 'rxjs/operators'
import {getTileManager} from '../tileManager/tileManager'
import {of, pipe, range, throwError, timer, zip} from 'rxjs'

export class BalancingTileProvider extends TileProvider {
    constructor({tileProvider, retries, progress$}) {
        super()
        this.subscriptions = []
        this.retries = retries
        this.tileManager = getTileManager(tileProvider)
        this.initProgress(progress$)
    }

    initProgress(progress$) {
        if (progress$) {
            this.subscriptions.push(
                this.tileManager.pending$.pipe(
                    debounceTime(200)
                ).subscribe(
                    pending => progress$.next({loading: pending, complete: !pending})
                )
            )
        }
    }

    getType() {
        return this.tileManager.getType()
    }

    getConcurrency() {
        return this.tileManager.getConcurrency()
    }

    loadTile$(tileRequest) {
        return of(true).pipe(
            switchMap(() => this.tileManager.loadTile$(tileRequest)),
            retry(this.retries, {description: tileRequest.id}),
        )
    }

    releaseTile(element) {
        this.tileManager.releaseTile(element.id)
    }

    hide(hidden) {
        this.tileManager.hide(hidden)
    }

    close() {
        this.tileManager.close()
        this.subscriptions.forEach(subscription => subscription.unsubscribe())
    }
}

const retry = (maxRetries, {minDelay = 500, maxDelay = 30000, exponentiality = 2, description} = {}) => pipe(
    retryWhen(error$ =>
        zip(
            error$,
            range(1, maxRetries + 1)
        ).pipe(
            mergeMap(
                ([error, retry]) => {
                    if (retry > maxRetries) {
                        return throwError(error)
                    } else {
                        const exponentialBackoff = Math.pow(exponentiality, retry) * minDelay
                        const cappedExponentialBackoff = Math.min(exponentialBackoff, maxDelay)
                        console.error(`Retrying ${description ? `${description} ` : ''}(${retry}/${maxRetries}) in ${cappedExponentialBackoff}ms after error: ${error}`)
                        return timer(cappedExponentialBackoff)
                    }
                }
            )
        )
    )
)
